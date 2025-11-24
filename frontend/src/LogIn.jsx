import React, { useState } from "react";
import "./login.css";
import logoSrc from "./assets/Light LocaleCafe logo.PNG";
import bg from "./assets/Login Signup bg.png";

export default function LogIn() {
  const [form, setForm] = useState({ email: "", password: "" });

  function update(field) {
    return (e) => setForm((s) => ({ ...s, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || JSON.stringify(data));
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);

        try {
          const payload = data.token.split(".")[1];
          const json = JSON.parse(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          );
          if (json.username) localStorage.setItem("username", json.username);
          // store explicit admin flag if present in token payload
          if (json.isAdmin) localStorage.setItem("isAdmin", "true");
        } catch (err) {
          // ignore decode errors
        }
        // prefer explicit isAdmin returned by the API if available
        const isAdminFromResponse = !!data.isAdmin;
        const isAdminStored =
          isAdminFromResponse || localStorage.getItem("isAdmin") === "true";
        alert("Logged in");
        window.location.href = isAdminStored ? "/a_home" : "/home";
      } else {
        alert("Logged in but token missing");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

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

            <form onSubmit={handleSubmit}>
              <label className="login-field-label">Email</label>
              <input
                className="text-input"
                type="email"
                name="email"
                value={form.email}
                onChange={update("email")}
              />

              <label className="login-field-label">Password</label>
              <input
                className="text-input"
                type="password"
                name="password"
                value={form.password}
                onChange={update("password")}
              />

              <div className="login-actions">
                <a className="btn outline" href="/register">
                  Sign Up
                </a>
                <button className="btn outline" type="submit">
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
