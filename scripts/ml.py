import pandas as pd
import numpy as np
from pymongo import MongoClient
import networkx as nx
import itertools
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler
import joblib
import warnings
warnings.filterwarnings("ignore")

# ---------- CONFIG ----------
MONGO_URI = "mongodb+srv://pranavrudraraju6_db_user:X7m0Bb9pIPFwU7Oq@cluster0.dm7hktz.mongodb.net/mydatabase?retryWrites=true&w=majority"
DB_NAME = "mydatabase"
POSTS_COLLECTION = "socialposts"
INFLUENCERS_COLLECTION = "influencers"
MODEL_FILE = "influence_model.pkl"
# ----------------------------

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
posts_col = db[POSTS_COLLECTION]
influencers_col = db[INFLUENCERS_COLLECTION]

# Load posts and influencer data
posts = list(posts_col.find({}, {"_id": 0, "influencerId": 1, "metrics": 1, "platform": 1}))
influencers = list(influencers_col.find({}, {"_id": 1, "followerCount": 1, "socialHandles": 1, "status": 1, "name": 1, "username": 1}))

df_posts = pd.DataFrame(posts)
df_influencers = pd.DataFrame(influencers)

if df_posts.empty or df_influencers.empty:
    raise SystemExit("❌ No data found in MongoDB. Run the data generation script first.")

df_posts["influencerId"] = df_posts["influencerId"].astype(str).str.strip()
df_influencers["_id"] = df_influencers["_id"].astype(str).str.strip()

# Merge posts with influencer metadata
df = df_posts.merge(df_influencers, left_on="influencerId", right_on="_id", how="left")

if "followerCount" not in df.columns:
    df["followerCount"] = 0.0
else:
    missing = df["followerCount"].isna().sum()
    print(f"✅ followerCount found. Missing values: {missing}")

# Extract engagement metrics safely
def safe_get(d, k, default=0):
    return d.get(k, default) if isinstance(d, dict) else default

df["likes"] = df["metrics"].apply(lambda m: safe_get(m, "likes"))
df["shares"] = df["metrics"].apply(lambda m: safe_get(m, "shares"))
df["reach"] = df["metrics"].apply(lambda m: safe_get(m, "reach", 1))
df["engagement_rate"] = ((df["likes"] + df["shares"]) / df["reach"]) * 100

df = df.dropna(subset=["engagement_rate"]).reset_index(drop=True)

# -----------------------------
# 🧩 Aggregate influencer-level features
# -----------------------------
inf_rows = []
for inf_id, group in df.groupby("influencerId"):
    inf_rows.append({
        "influencerId": inf_id,
        "post_count": len(group),
        "avg_likes": group["likes"].mean(),
        "avg_shares": group["shares"].mean(),
        "avg_reach": group["reach"].mean(),
        "avg_engagement_rate": group["engagement_rate"].mean(),
        "followerCount": group["followerCount"].iloc[0] if "followerCount" in group else 0,
        "platform": group["platform"].iloc[0]
    })

df_inf = pd.DataFrame(inf_rows).set_index("influencerId")

# -----------------------------
# 🌐 Build similarity graph
# -----------------------------
G = nx.Graph()
for inf in df_inf.index:
    G.add_node(inf)

avg_eng = (df_inf["avg_likes"].fillna(0) + df_inf["avg_shares"].fillna(0)).to_dict()
threshold = np.percentile(list(avg_eng.values()), 75) * 0.5

for a, b in itertools.combinations(avg_eng.keys(), 2):
    diff = abs(avg_eng[a] - avg_eng[b])
    if diff < threshold:
        weight = 1 / (1 + diff)
        G.add_edge(a, b, weight=weight)

degree_c = nx.degree_centrality(G)
betw_c = nx.betweenness_centrality(G)
try:
    eig_c = nx.eigenvector_centrality(G, max_iter=200)
except Exception:
    eig_c = {n: 0.0 for n in G.nodes()}

df_inf["degree_centrality"] = df_inf.index.to_series().map(degree_c).fillna(0.0)
df_inf["betweenness_centrality"] = df_inf.index.to_series().map(betw_c).fillna(0.0)
df_inf["eigenvector_centrality"] = df_inf.index.to_series().map(eig_c).fillna(0.0)

# -----------------------------
# 🧠 Prepare ML Training Data
# -----------------------------
feature_cols_inf = [
    "post_count", "avg_likes", "avg_shares", "avg_reach", "followerCount",
    "degree_centrality", "betweenness_centrality", "eigenvector_centrality"
]

df_posts_final = df.merge(df_inf[feature_cols_inf], left_on="influencerId", right_index=True, how="left")

feature_cols = ["likes", "shares", "reach"] + feature_cols_inf
df_train = df_posts_final.dropna(subset=["engagement_rate"]).copy()

for col in feature_cols:
    if col not in df_train.columns:
        df_train[col] = 0.0

X = df_train[feature_cols].fillna(0)
y = df_train["engagement_rate"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -----------------------------
# ⚙️ Train Random Forest Model
# -----------------------------
model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"✅ Model trained — MSE: {mse:.4f} | R²: {r2:.4f}")

# Save model and scaler
joblib.dump(model, MODEL_FILE)
joblib.dump(scaler, "influence_scaler.pkl")
print(f"💾 Model saved to {MODEL_FILE}")

# -----------------------------
# 🏆 Compute Influence Scores
# -----------------------------
X_all_scaled = scaler.transform(df_train[feature_cols].fillna(0))
df_train["pred_engagement_rate"] = model.predict(X_all_scaled)

inf_scores = df_train.groupby("influencerId")["pred_engagement_rate"].mean().rename("influence_score")
df_inf = df_inf.join(inf_scores).sort_values("influence_score", ascending=False)
df_inf["rank"] = range(1, len(df_inf) + 1)

# -----------------------------
# 🧩 Add Influencer Names, Status & Handles
# -----------------------------
influencer_meta = {}
for _, row in df_influencers.iterrows():
    _id = str(row["_id"])
    name = row.get("name") or row.get("username")
    handle = None
    if "socialHandles" in row and isinstance(row["socialHandles"], dict):
        handles = list(row["socialHandles"].values())
        if handles:
            handle = handles[0].replace("@", "")
    influencer_meta[_id] = {
        "name": name or handle or "Unknown",
        "status": row.get("status", "Unknown"),
        "handle": handle or "N/A"
    }

# -----------------------------
# 💾 Save Rankings to MongoDB
# -----------------------------
rank_docs = []
for inf, row in df_inf.reset_index().iterrows():
    inf_id = str(row["influencerId"])
    meta = influencer_meta.get(inf_id, {})
    doc = {
        "influencerId": inf_id,
        "influencer_name": meta.get("name", "Unknown"),
        "social_handle": meta.get("handle", "N/A"),
        "status": meta.get("status", "Unknown"),
        "influence_score": float(row["influence_score"]),
        "rank": int(row["rank"]),
        "post_count": int(row["post_count"]),
        "avg_likes": float(row["avg_likes"]),
        "avg_shares": float(row["avg_shares"]),
        "avg_reach": float(row["avg_reach"]),
        "followerCount": float(row["followerCount"]),
        "degree_centrality": float(row["degree_centrality"]),
        "betweenness_centrality": float(row["betweenness_centrality"]),
        "eigenvector_centrality": float(row["eigenvector_centrality"]),
        "platform": row["platform"],
    }
    rank_docs.append(doc)

db["influencer_rankings"].delete_many({})
db["influencer_rankings"].insert_many(rank_docs)
print("🏆 Influencer rankings written to MongoDB with names and handles included")

print("\nTop 10 Influencers:")
print(df_inf.reset_index()[["influencerId", "platform", "influence_score", "rank"]].head(10))