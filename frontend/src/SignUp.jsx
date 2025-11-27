import "./login.css";
import logoSrc from "./assets/Light LocaleCafe logo.PNG";
import bg from "./assets/Login Signup bg.png";
import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/authentication/register`,

        {
          first_name,
          last_name,
          email,
          phone,
          password,
        }
      );

      alert("Account created");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
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
            <h1 className="login-title">Sign Up</h1>

            <label className="login-field-label">First Name</label>
            <input
              className="text-input"
              type="text"
              name="firstName"
              required
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label className="login-field-label">Last Name</label>
            <input
              className="text-input"
              type="text"
              name="lastName"
              required
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />

            <label className="login-field-label">Email</label>
            <input
              className="text-input"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="login-field-label">Phone Number</label>
            <input
              className="text-input"
              type="tel"
              name="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label className="login-field-label">Password</label>
            <input
              className="text-input"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="login-actions">
              <button className="btn outline" onClick={handleSubmit}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
