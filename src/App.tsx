import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Planner from "@/pages/Planner";
import Sandbox from "@/pages/Sandbox";
import Voice from "@/pages/Voice";
import Profile from "@/pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}