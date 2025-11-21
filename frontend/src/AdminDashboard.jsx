import React from "react";
import "./admin_index.css";
import logoSrc from "./assets/Light LocaleCafe logo.PNG";
import homeBg from "./assets/homebg.png";

function AdminDashboard() {
  return (
    <>
      <div
        className="page-bg"
        style={{
          backgroundImage: `url(${homeBg})`,
        }}
      >
        <header className="header">
          <a href="/" className="logo">
            <img src={logoSrc} alt="LocaleCafe logo" className="header-logo" />
          </a>

          <nav className="navibar">
            <p
              id="for-the-selection-button-3"
              className="for-the-selection-button-3"
            ></p>
            <a href="/">Home</a>
            <a className="c-button" href="/logout">
              <span className="label">Log Out</span>
            </a>
          </nav>
        </header>

        <main className="page-content">
          <h1>Welcome to the Cafe!</h1>
          <p>Enjoy our delicious menu and cozy atmosphere.</p>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;
