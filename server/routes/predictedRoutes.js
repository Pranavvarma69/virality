const express = require("express");
const router = express.Router();
const path = require("path");
const { spawnSync } = require("child_process");

// Path to your Python script (you can reuse your existing ml.py or create a new predict.py)
const pythonScript = path.join(__dirname, "../../scripts/predict.py");

router.post("/", async (req, res) => {
  try {
    const { followerCount, avg_likes, avg_shares, avg_reach, post_count } = req.body;

    if ([followerCount, avg_likes, avg_shares, avg_reach].some(v => v == null)) {
      return res.status(400).json({ message: "Missing input values" });
    }

    // Prepare input for Python script
    const inputData = JSON.stringify({
      followerCount,
      avg_likes,
      avg_shares,
      avg_reach,
      post_count: post_count || 1,
    });

    // Run Python synchronously
    const py = spawnSync("python3", [pythonScript, inputData], { encoding: "utf-8" });

    if (py.error) {
      console.error("❌ Python execution error:", py.error);
      return res.status(500).json({ message: "Python execution failed" });
    }

    const output = py.stdout.trim();
    console.log("📊 Python output:", output);

    const result = JSON.parse(output);

    res.json({
      predicted_engagement_rate: result.predicted,
      message: "Prediction successful",
    });
  } catch (err) {
    console.error("❌ Prediction route error:", err);
    res.status(500).json({ message: "Prediction failed" });
  }
});

module.exports = router;