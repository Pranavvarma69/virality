import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, ResponsiveContainer
} from "recharts";
import { AnalyticsData } from "../api/analyticsAPI";

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await AnalyticsData();
         console.log("✅ Analytics data:",res);
        setData(res);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Influencer Analytics Dashboard</h2>

      {/* 1️⃣ Influence Score Distribution */}
      <h5>Influence Score Distribution</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.scoreDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>

      

      {/* 3️⃣ Followers vs Engagement */}
      <h5 className="mt-5">Followers vs Engagement</h5>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="followerCount" name="Followers" />
          <YAxis type="number" dataKey="avg_engagement_rate" name="Engagement Rate" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data.followerEngagement} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>

      {/* 4️⃣ Top Influencers by Platform */}
      <h5 className="mt-5">Top Influencers by Platform</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.topByPlatform}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgScore" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>

      {/* 5️⃣ Network Centrality (Top 10) */}
      <h5 className="mt-5">Top 10 Influencers by Network Centrality</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.centrality}>
          <XAxis dataKey="influencerId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="degree_centrality" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default AnalyticsPage;