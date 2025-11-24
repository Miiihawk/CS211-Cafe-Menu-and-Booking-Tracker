import React from "react";
import "./admin_index.css";
import logoSrc from "../../assets/Light LocaleCafe logo.PNG";
import homeBg from "../../assets/homebg.png";

function AdminDashboard() {
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  }

  return (
    <>
      <header className="header">
        <a href="/a_home" className="logo">
          <img src={logoSrc} alt="LocaleCafe logo" className="header-logo" />
        </a>

        <nav className="navibar">
          <p
            id="for-the-selection-button-3"
            className="for-the-selection-button-3"
          ></p>
          <a href="a_home">Home</a>
          <button className="c-button" onClick={handleLogout} type="button">
            <span className="label">Log Out</span>
          </button>
        </nav>
      </header>

      <main id="dashboard" className="dashboard-section">
        <img
          className="dashboard-bg"
          src={homeBg}
          alt="A close-up of a waffle with jam."
        />
        <div className="dashboard-overlay">
          <div className="stats-wrapper">
            <div className="stats-row">
              <div className="stat-card dark-card">
                <h3 className="stat-title">Total Bookings</h3>
                <p className="stat-number">20</p>
                <p className="stat-period">this month</p>
              </div>
              <div className="stat-card dark-card">
                <h3 className="stat-title">Site Visitors</h3>
                <p className="stat-number">70</p>
                <p className="stat-period">this month</p>
              </div>
              <div className="stat-card dark-card">
                <h3 className="stat-title">Menu Items</h3>
                <p className="stat-number">25</p>
                <p className="stat-period">in total</p>
              </div>
            </div>
            <div className="stats-row justify-center">
              <div className="stat-card light-card">
                <h3 className="stat-title">Pending Bookings</h3>
                <p className="stat-number">2</p>
                <p className="stat-period">this month</p>
              </div>
              <div className="stat-card light-card">
                <h3 className="stat-title">Gallery Uploads</h3>
                <p className="stat-number">30</p>
                <p className="stat-period">in total</p>
              </div>
            </div>
          </div>
          <div className="actions-row">
            <a href="#" className="action-button">
              Menu Items
            </a>
            <a href="/a_menu" className="action-button">
              Edit Menu Items
            </a>
            <a href="/a_gallery" className="action-button">
              Upload Gallery
            </a>
            <a href="/a_booking" className="action-button">
              View Booking
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;
