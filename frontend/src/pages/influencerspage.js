import React, { useEffect, useState } from "react";
import { Table, Container, Spinner, Alert } from "react-bootstrap";
import { getInfluencers } from "../api/influencerAPI";

const InfluencerPage = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const data = await getInfluencers();
        setInfluencers(data);
      } catch (err) {
        console.error("❌ Error fetching influencers:", err);
        setError("Failed to load influencer data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInfluencers();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error)
    return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">All Influencers</h2>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Platform</th>
            <th>Followers</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {influencers.map((inf, index) => (
            <tr key={inf._id}>
              <td>{index + 1}</td>
              <td>{inf.name || "N/A"}</td>
              <td>
                {inf.socialHandles
                  ? Object.keys(inf.socialHandles)[0]
                  : "Unknown"}
              </td>
              <td>{inf.followerCount?.toLocaleString()}</td>
              <td>{inf.status || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default InfluencerPage;