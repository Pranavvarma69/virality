import React, { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authAPI";

const LoginPage = () => {
  // React state hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle login form submit
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data=await loginUser({ email, password }); // Call API
      localStorage.setItem("userInfo", JSON.stringify(data));
      window.dispatchEvent(new Event("userChanged"));
      navigate("/"); // Redirect to dashboard/home
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Return JSX inside the component
  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // updates state on typing
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Login"}
        </Button>
      </Form>

      <div className="text-center mt-3">
        New user? <a href="/register">Register</a>
      </div>
    </Container>
  );
};

export default LoginPage;