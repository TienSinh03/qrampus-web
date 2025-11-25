// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // 👉 điều hướng qua trang /login
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trang chủ</h1>
      <button onClick={handleLoginClick}>
        Login
      </button>
    </div>
  );
}
