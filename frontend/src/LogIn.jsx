import React from "react";
import "./login.css";
import logoSrc from "./assets/Light LocaleCafe logo.PNG";
import bg from "./assets/Login Signup bg.png";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/authentication/login`,
        { email, password }
      );

      const { token, role } = response.data;

      // Save token in localStorage (or cookies)
      localStorage.setItem("token", token);

      // Redirect based on role
      if (role === "admin") {
        navigate("/a_home");
      } else if (role === "customer") {
        navigate("/home");
      } else {
        console.error("No such role exist");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <header className="header">
        <a href="/" className="logo">
          <img src={logoSrc} alt="LocaleCafe logo" className="header-logo" />
        </a>

        <nav className="navibar">
          <a href="/">Home</a>
        </nav>
      </header>

      <main className="login-section">
        <img src={bg} alt="" className="login-bg" />
        <div className="login-overlay">
          <div className="login-card">
            <h1 className="login-title">Log In</h1>

            <form onSubmit={submit}>
              <label className="field-label">Email</label>
              <input
                className="text-input"
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="field-label">Password</label>
              <input
                className="text-input"
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="login-actions">
                <a className="btn outline" href="/register">
                  Sign Up
                </a>
                <button className="btn outline">Log In</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
