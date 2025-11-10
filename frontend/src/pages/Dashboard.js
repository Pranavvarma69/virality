import React, { useEffect, useState } from "react";
import { gettopinfluencers } from "../api/influencerAPI";
import { Container, Table, Spinner, Alert, Card } from "react-bootstrap";

const Dashboard = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const data = await gettopinfluencers();
        setInfluencers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch influencer data");
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencers();
  }, []);

  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h2 className="text-center mb-4 fw-bold text-primary">
            🌟 Top 10 Influencers
          </h2>
          <Table
            striped
            bordered
            hover
            responsive
            className="align-middle text-center"
          >
            <thead className="table-dark">
              <tr>
                <th>🏆 Rank</th>
                <th>👤 Name</th>
                <th>💬 Platform</th>
                <th>👥 Followers</th>
                <th>🔥 Influence Score</th>
              </tr>
            </thead>
            <tbody>
              {influencers.slice(0, 10).map((inf) => (
                <tr key={inf._id || inf.influencerId}>
                  <td className="fw-bold">{inf.rank}</td>
                  <td>{inf.influencer_name || inf.username || "N/A"}</td>
                  <td className="text-capitalize">
                    {inf.platform || "Unknown"}
                  </td>
                  <td>{inf.followerCount?.toLocaleString()}</td>
                  <td className="fw-semibold text-success">
                    {inf.influence_score?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;