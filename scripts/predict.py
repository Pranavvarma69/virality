import sys
import json
import joblib
import os
import numpy as np
import warnings
warnings.filterwarnings("ignore")

# --- Dynamic absolute paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "influence_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "influence_scaler.pkl")

# Load model & scaler
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Read JSON input from Node
data = json.loads(sys.argv[1])

# Extract features
features = np.array([[
    data["avg_likes"],
    data["avg_shares"],
    data["avg_reach"],
    data["post_count"],
    data["avg_likes"],
    data["avg_shares"],
    data["avg_reach"],
    data["followerCount"],
    0, 0, 0
]])

# Scale + predict
scaled = scaler.transform(features)
pred = model.predict(scaled)[0]

# Return JSON to Node
print(json.dumps({"predicted": float(pred)}))