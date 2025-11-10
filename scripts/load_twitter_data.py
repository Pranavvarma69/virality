import pandas as pd
from pymongo import MongoClient
from datetime import datetime

# ---------- CONFIG ----------
CSV_PATH = "/Users/rudrarajupranav/Desktop/socialcomputing/scripts/combined_influencer_posts.csv"  # path to your uploaded CSV
MONGO_URI = "mongodb+srv://pranavrudraraju6_db_user:X7m0Bb9pIPFwU7Oq@cluster0.dm7hktz.mongodb.net/mydatabase?retryWrites=true&w=majority"
DB_NAME = "mydatabase"
# ----------------------------

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
influencers_col = db["influencers"]
socialposts_col = db["socialposts"]

# Clear old data (optional)
influencers_col.delete_many({})
socialposts_col.delete_many({})
print("🧹 Cleared old data in 'influencers' and 'socialposts' collections")

# Load CSV
df = pd.read_csv(CSV_PATH)
print(f"📄 Loaded {len(df)} rows from CSV")

# Insert unique influencers
unique_influencers = df.drop_duplicates(subset=["influencer_name"]).copy()

influencer_docs = []
for _, row in unique_influencers.iterrows():
    influencer_docs.append({
        "name": row["influencer_name"],
        "username": row["username"],
        "socialHandles": {row["platform"]: f"@{row['username']}"},
        "followerCount": int(row["followerCount"]),
        "status": row.get("status", "active"),
        "platform": row["platform"],
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    })

if influencer_docs:
    result = influencers_col.insert_many(influencer_docs)
    print(f"✅ Inserted {len(result.inserted_ids)} influencers")

# Create a mapping of influencer_name → MongoDB _id
name_to_id = {
    doc["name"]: str(doc["_id"])
    for doc in influencers_col.find({}, {"_id": 1, "name": 1})
}

# Insert posts
post_docs = []
for _, row in df.iterrows():
    inf_id = name_to_id.get(row["influencer_name"])
    if not inf_id:
        continue
    post_docs.append({
        "influencerId": inf_id,
        "platform": row["platform"],
        "postId": str(row["postId"]),
        "text": row["text"],
        "metrics": {
            "likes": int(row["likes"]),
            "shares": int(row["shares"]),
            "reach": int(row["reach"]),
        },
        "engagement_rate": float(row["engagement_rate"]),
        "predictedVirality": float(row["predictedVirality"]),
        "createdAt": pd.to_datetime(row["createdAt"]),
        "updatedAt": datetime.now()
    })

if post_docs:
    result = socialposts_col.insert_many(post_docs)
    print(f"✅ Inserted {len(result.inserted_ids)} posts")

print("🎉 Data successfully loaded into MongoDB!")