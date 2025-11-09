import random
import numpy as np
from faker import Faker
from pymongo import MongoClient
from datetime import datetime

# Initialize Faker
fake = Faker()
Faker.seed(42)

# Connect to MongoDB
client = MongoClient("mongodb+srv://pranavrudraraju6_db_user:X7m0Bb9pIPFwU7Oq@cluster0.dm7hktz.mongodb.net/mydatabase?retryWrites=true&w=majority")
db = client["mydatabase"]
influencers_col = db["influencers"]
socialposts_col = db["socialposts"]

# Clear old synthetic data (optional)
influencers_col.delete_many({})
socialposts_col.delete_many({})

# Define platform engagement behavior
platforms = {
    "instagram": {"followers_range": (5_000, 500_000), "engagement_range": (1.5, 5.0)},
    "youtube": {"followers_range": (10_000, 2_000_000), "engagement_range": (0.5, 2.0)},
    "tiktok": {"followers_range": (1_000, 1_000_000), "engagement_range": (4.0, 12.0)},
}

# Number of influencers to generate
NUM_INFLUENCERS = 100
print(f"🧩 Generating {NUM_INFLUENCERS} influencers with realistic names...")

for i in range(NUM_INFLUENCERS):
    # Randomly assign a platform
    platform = random.choice(list(platforms.keys()))
    follower_count = random.randint(*platforms[platform]["followers_range"])
    base_engagement_rate = random.uniform(*platforms[platform]["engagement_range"])

    # Generate realistic influencer info
    full_name = fake.name()
    username = full_name.lower().replace(" ", "_").replace(".", "")
    handle = f"@{username}"

    # Create influencer document
    influencer_doc = {
        "name": full_name,
        "userId": None,
        "socialHandles": {platform: handle},
        "username": username,
        "followerCount": follower_count,
        "status": random.choice(["active", "prospect", "inactive"]),
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }

    influencer_result = influencers_col.insert_one(influencer_doc)
    influencer_id = influencer_result.inserted_id

    # Generate 5–15 synthetic posts per influencer
    num_posts = random.randint(5, 15)
    for _ in range(num_posts):
        # Engagement simulation
        reach = int(follower_count * np.random.uniform(0.1, 0.6))
        likes = int(reach * (base_engagement_rate / 100) * np.random.uniform(0.5, 1.2))
        shares = int(likes * np.random.uniform(0.05, 0.3))

        post_doc = {
            "influencerId": influencer_id,
            "platform": platform,
            "postId": fake.uuid4(),
            "text": fake.sentence(nb_words=12),
            "createdAt": fake.date_time_this_year(),
            "metrics": {
                "likes": likes,
                "shares": shares,
                "reach": reach
            },
            "predictedVirality": round(np.random.uniform(0, 1), 3),
            "updatedAt": datetime.now()
        }

        socialposts_col.insert_one(post_doc)

    print(f"✅ Added {num_posts} posts for {platform} influencer {full_name} ({follower_count} followers)")

print(f"🎉 Finished generating {NUM_INFLUENCERS} influencers with realistic names and posts!")