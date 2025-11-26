import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReviewScreenLayout from "./components/review-page.jsx";
import { Home } from "./components/home.jsx";
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
