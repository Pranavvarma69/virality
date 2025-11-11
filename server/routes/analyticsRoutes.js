const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const rankings = db.collection("influencer_rankings");
    const influencers = db.collection("influencers");

    // 1️⃣ Influence Score Distribution (binned)
    const scores = await rankings.find({}, { projection: { influence_score: 1 } }).toArray();
    const bins = [0, 20, 40, 60, 80, 100];
    const distribution = bins.map((b, i) => ({
      range: i < bins.length - 1 ? `${b}-${bins[i + 1]}` : `${b}+`,
      count: scores.filter(
        (s) => s.influence_score >= b && s.influence_score < (bins[i + 1] || 200)
      ).length,
    }));

    // 2️⃣ Platform Breakdown
    const platforms = await influencers
      .aggregate([
        {
          $group: {
            _id: { $first: { $objectToArray: "$socialHandles" } },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // 3️⃣ Followers vs Engagement (✅ Fixed version)
    const followerEngagementRaw = await rankings
      .find({}, { projection: { followerCount: 1, avg_likes: 1, avg_shares: 1, avg_reach: 1 } })
      .toArray();

    const followerEngagement = followerEngagementRaw.map((d) => ({
      followerCount: d.followerCount || 0,
      avg_engagement_rate: d.avg_reach
        ? ((d.avg_likes + d.avg_shares) / d.avg_reach) * 100
        : 0,
    }));

    // 4️⃣ Top Influencers by Platform
    const topByPlatform = await rankings
      .aggregate([
        {
          $group: {
            _id: "$platform",
            avgScore: { $avg: "$influence_score" },
          },
        },
      ])
      .toArray();

    // 5️⃣ Centrality Scores (top 10)
    const centrality = await rankings
      .find({}, { projection: { influencerId: 1, degree_centrality: 1 } })
      .sort({ degree_centrality: -1 })
      .limit(10)
      .toArray();

    // ✅ Send analytics data
    res.json({
      scoreDistribution: distribution,
      platformBreakdown: platforms.map((p) => ({
        platform: p._id ? Object.keys(p._id[0] || { unknown: 1 })[0] : "Unknown",
        count: p.count,
      })),
      followerEngagement,
      topByPlatform,
      centrality,
    });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;