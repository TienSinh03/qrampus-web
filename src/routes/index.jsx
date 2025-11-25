// src/routes/index.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chính (nơi có nút Login) */}
        <Route path="/" element={<Home />} />

        {/* Trang login */}
        <Route path="/login" element={<Login />} />

        {/* Sau này bạn thêm các route khác như dashboard, courses,... */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
