import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login with:", email, password);

    // TODO: gọi API login tại đây
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f4f4"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "350px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Đăng nhập</h2>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />

        <label>Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
