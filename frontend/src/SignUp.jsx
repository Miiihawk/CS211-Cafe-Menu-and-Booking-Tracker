import React from "react";
import "./login.css";
import logoSrc from "./assets/Light LocaleCafe logo.PNG";
import bg from "./assets/Login Signup bg.png";

export default function SignUp() {
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

            <label className="field-label">First Name</label>
            <input className="text-input" type="text" name="firstName" />

            <label className="field-label">Last Name</label>
            <input className="text-input" type="text" name="lastName" />

            <label className="field-label">Email</label>
            <input className="text-input" type="email" name="email" />

            <label className="field-label">Phone Number</label>
            <input className="text-input" type="tel" name="phone" />

            <label className="field-label">Password</label>
            <input className="text-input" type="password" name="password" />

            <div className="login-actions">
              <button className="btn outline">Sign Up</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
