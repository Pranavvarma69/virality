import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navb from "./components/Navbar";  // ✅ Your Navbar component
import Dashboard from "./pages/Dashboard";  // ✅ Your dashboard page
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InfluencerPage from "./pages/influencerspage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PredictPage from "./pages/PredictPage";

function App() {
  return (
    <Router>
      <Navb />   {/* 👈 This renders your Navbar at the top */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/influencers" element={<InfluencerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/predict" element={<PredictPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;