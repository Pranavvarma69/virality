import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import axios from "axios";


const PredictPage=()=>{
    const [formData,setFormData]=useState({
        followerCount: "",
        avg_likes: "",
        avg_shares: "",
        avg_reach: "",
        post_count: "",
    });
    const [loading,setLoading]=useState(false);
    const [result,setResult]=useState(null);
    const [error,setError]=useState('');

    const handleChange=(e)=>{
        setFormData({...formData, [e.target.name]: e.target.value})
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try{
            const res=await axios.post("/api/predict",{
                followerCount: Number(formData.followerCount),
                avg_likes: Number(formData.avg_likes),
                avg_shares: Number(formData.avg_shares),
                avg_reach: Number(formData.avg_reach),
                post_count: Number(formData.post_count),
            });
            setResult(res.data.predicted_engagement_rate.toFixed(2));
        }catch(err){
            setError("Prediction failed. Check input values.");
        }finally{
            setLoading(false);
        }

    };
    return(
        <Container className="mt-5" style={{maxWidth: "600px"}}>
            <h3 className="text-center mb-4">predict influencers engagement score</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <Form.Group className="mb-3">
                    <Form.Label>follower Count</Form.Label>
                    <Form.Control
                    type="number"
                    name="followerCount"
                    value={formData.followerCount}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Average likes</Form.Label>
                    <Form.Control 
                    type="number"
                    name="avg_likes"
                    value={formData.avg_likes}
                    onChange={handleChange}
                    required/>


                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Average shares</Form.Label>
                    <Form.Control
                    type="number"
                    name="avg_shares"
                    value={formData.avg_shares}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Average Reach</Form.Label>
                    <Form.Control
                    type="number"
                    name="avg_reach"
                    value={formData.avg_reach}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Post Count</Form.Label>
                    <Form.Control
                    type="number"
                    name="post_count"
                    value={formData.post_count}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}> {loading ? <Spinner animation="border" size="sm" /> : "Predict"}</Button>

                
            </Form>
            {result && (
                <Card className="mt-4 p-3 text-center shadow-sm">
                <h4>Predicted Engagement Rate: <b>{result}%</b></h4>
                </Card>
            )}
        </Container>
    )

}
export default PredictPage;