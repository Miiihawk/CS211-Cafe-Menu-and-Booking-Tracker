import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin_index.css";
import logoSrc from "../../assets/Light LocaleCafe logo.PNG";
import homeBg from "../../assets/homebg.png";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = (API_URL || "").replace(/\/$/, "");

function AdminDashboard() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [menuItemsCount, setMenuItemsCount] = useState(0);
  const [galleryUploadsCount, setGalleryUploadsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  function handleAuthError() {
    localStorage.removeItem("token");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    alert("Session expired. Please log in again.");
    window.location.href = "/login";
  }

  async function loadStats() {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      // bookings
      const bRes = await axios.get(`${baseUrl}/booking`, { headers });
      const bookings = Array.isArray(bRes.data) ? bRes.data : [];
      setTotalBookings(bookings.length);
      setPendingBookings(
        bookings.filter((b) => (b.booking_status || b.status) === "pending")
          .length
      );
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "";
      if (err.response?.status === 401 || /invalid|expired/i.test(msg))
        return handleAuthError();
      console.warn("could not load bookings:", msg);
    }

    try {
      // menu items
      const mRes = await axios
        .get(`${baseUrl}/menu`, { headers })
        .catch(() =>
          axios.get(`${baseUrl}/items`, { headers }).catch(() => null)
        );
      if (mRes && Array.isArray(mRes.data)) setMenuItemsCount(mRes.data.length);
    } catch (err) {
      console.warn("could not load menu items:", err.message || err);
    }

    try {
      // gallery uploads
      const gRes = await axios
        .get(`${baseUrl}/gallery`, { headers })
        .catch(() => null);
      if (gRes && Array.isArray(gRes.data))
        setGalleryUploadsCount(gRes.data.length);
    } catch (err) {
      console.warn("could not load gallery:", err.message || err);
    }
  }

  async function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
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
                <h3 className="stat-title">
                  Total Bookings
                  <p className="stat-number">{totalBookings}</p>
                </h3>
                <p className="stat-period">this month</p>
              </div>
              <div className="stat-card dark-card">
                <h3 className="stat-title">
                  No. of Customers
                  <p className="stat-number">{customersCount}</p>
                </h3>
              </div>
              <div className="stat-card dark-card">
                <h3 className="stat-title">
                  Menu Items
                  <p className="stat-number">{menuItemsCount}</p>
                </h3>
                <p className="stat-period">in total</p>
              </div>
            </div>
            <div className="stats-row justify-center">
              <div className="stat-card light-card">
                <h3 className="stat-title">
                  Pending Bookings
                  <p className="stat-number">{pendingBookings}</p>
                </h3>
                <p className="stat-period">this month</p>
              </div>
              <div className="stat-card light-card">
                <h3 className="stat-title">
                  Gallery Uploads
                  <p className="stat-number">{galleryUploadsCount}</p>
                </h3>
                <p className="stat-period">in total</p>
              </div>
            </div>
          </div>
          <div className="actions-row">
            <a href="/a_packages" className="action-button">
              Edit Packages
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
