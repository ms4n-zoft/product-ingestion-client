import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReviewScreenLayout from "./components/review-page";
import { Home } from "./components/home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review" element={<ReviewScreenLayout />} />
      </Routes>
    </Router>
  );
}
