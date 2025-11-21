import React from 'react'
import "./login.css";
import logoSrc from "./assets/Light LocaleCafe logo.PNG";
import bg from "./assets/Login Signup bg.png";

export default function LogIn() {
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

            <label className="field-label">Email</label>
            <input className="text-input" type="email" name="email" />

            <label className="field-label">Password</label>
            <input className="text-input" type="password" name="password" />

            <div className="login-actions">
              <a className="btn outline" href="/register">Sign Up</a>
              <button className="btn outline">Log In</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}