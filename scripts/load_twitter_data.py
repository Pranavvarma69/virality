import pandas as pd
import random
from pymongo import MongoClient

# --- Step 1: Load dataset and remove duplicates ---
df = pd.read_csv("/Users/rudrarajupranav/Downloads/tweets-engagement-metrics 2.csv")
df = df.drop_duplicates(subset='TweetID')

# --- Step 2: Assign random influencer names ---
num_influencers = 100
influencer_names = [f"influencer_{i+1}" for i in range(num_influencers)]
df['influencer_name'] = [random.choice(influencer_names) for _ in range(len(df))]

# --- Step 3: Calculate engagement score ---
df['engagement'] = df.get('Likes', 0) + df.get('RetweetCount', 0)
df['engagement_rate'] = df['engagement'] / df['Reach']

# --- Step 4: Sort by engagement descending and take top 1000 ---
df_top = df.sort_values(by='engagement', ascending=False).head(1000)

# --- Step 5: Prepare documents for MongoDB ---
social_posts = []
for _, row in df_top.iterrows():
    social_posts.append({
        "influencer_name": row['influencer_name'],
        "platform": "twitter",
        "postId": row['TweetID'],
        "text": row.get('text', ''),
        "metrics": {
            "likes": row.get('Likes', 0),
            "retweets": row.get('RetweetCount', 0),
            "reach": row.get('Reach', 0),
        },
    })

# --- Step 6: Connect to MongoDB Atlas ---
client = MongoClient(
    "mongodb+srv://pranavrudraraju6_db_user:X7m0Bb9pIPFwU7Oq@cluster0.dm7hktz.mongodb.net/mydatabase?retryWrites=true&w=majority"
)
db = client['mydatabase']          # database name
collection = db['socialposts']     # collection name

# --- Step 7: Optional: Clear old records ---
collection.delete_many({})

# --- Step 8: Insert new records ---
if social_posts:
    result = collection.insert_many(social_posts)
    print(f"Inserted {len(result.inserted_ids)} top records into MongoDB")
else:
    print("No records to insert")