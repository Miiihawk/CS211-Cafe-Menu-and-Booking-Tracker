import React, { useState } from "react";
import "./login.css";
import logoSrc from "./assets/Light LocaleCafe logo.PNG";
import bg from "./assets/Login Signup bg.png";

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  function update(field) {
    return (e) => setForm((s) => ({ ...s, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || JSON.stringify(data));
        return;
      }
      // do not auto-login after signup — send user to the login page
      alert("Sign up successful. Please log in.");
      window.location.href = "/login";
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
            <h1 className="login-title">Sign Up</h1>

            <form onSubmit={handleSubmit}>
              <label className="login-field-label">Username</label>
              <input
                className="text-input"
                type="text"
                name="username"
                value={form.username}
                onChange={update("username")}
              />

              <label className="login-field-label">First Name</label>
              <input
                className="text-input"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={update("firstName")}
              />

              <label className="login-field-label">Last Name</label>
              <input
                className="text-input"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={update("lastName")}
              />

              <label className="login-field-label">Email</label>
              <input
                className="text-input"
                type="email"
                name="email"
                value={form.email}
                onChange={update("email")}
              />

              <label className="login-field-label">Phone Number</label>
              <input
                className="text-input"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={update("phone")}
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
                <button className="btn outline" type="submit">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
