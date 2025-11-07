import pandas as pd
import random
from pymongo import MongoClient

# Load dataset

df = pd.read_csv("/Users/rudrarajupranav/Downloads/tweets-engagement-metrics 2.csv")
df = df.drop_duplicates(subset='TweetID')

# Assign random influencer names
num_influencers = 1000
influencer_names = [f"influencer_{i+1}" for i in range(num_influencers)]
df['influencer_name'] = [random.choice(influencer_names) for _ in range(len(df))]

# Calculate engagement (likes + retweets)
df['engagement'] = df['Likes'] + df['RetweetCount']

# Calculate engagement_rate as target variable
df['engagement_rate'] = df['engagement'] / df['Reach']

# Sort by engagement descending and take top 1000
df_top = df.sort_values(by='engagement', ascending=False).head(1000)

# Prepare data for MongoDB
social_posts = []
for _, row in df_top.iterrows():
    social_posts.append({
        "influencer_name": row['influencer_name'],
        "platform": "twitter",
        "postId": row['TweetID'],
        "text": row['text'],
        "metrics": {
            "likes": row['Likes'],
            "retweets": row['RetweetCount'],
            "reach": row['Reach'],
        },
        "target": {
            "engagement_rate": row['engagement_rate']  # target variable for ML
        }
    })

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://pranavrudraraju6_db_user:X7m0Bb9pIPFwU7Oq@cluster0.dm7hktz.mongodb.net/mydatabase?retryWrites=true&w=majority")
db = client['mydatabase']
collection = db['socialposts']
collection.delete_many({})
print("Deleted all existing records")

# Insert into MongoDB
result = collection.insert_many(social_posts)
print(f"Inserted {len(result.inserted_ids)} top records into MongoDB with engagement_rate")