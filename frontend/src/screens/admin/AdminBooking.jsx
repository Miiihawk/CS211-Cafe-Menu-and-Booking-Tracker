import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin_booking.css";
import "./admin_index.css";
import logoSrc from "../../assets/Light LocaleCafe logo.PNG";
import bg from "../../assets/admin-mbg.png";

const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = (API_URL || "").replace(/\/$/, "");

export default function AdminBooking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/booking`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("loadBookings:", err);
      const msg = err.response?.data?.message || err.message || "";
      if (err.response?.status === 401 || /invalid|expired/i.test(msg)) {
        // clear auth and force login
        localStorage.removeItem("token");
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem("username");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("userId");
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
        return;
      }
      alert("Could not load bookings: " + msg);
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
          <a href="/a_home">Home</a>
          <button className="c-button" onClick={handleLogout} type="button">
            <span className="label">Log Out</span>
          </button>
        </nav>
      </header>

      <main className="booking-section">
        <img className="booking-bg" src={bg} alt="background" />
        <div className="booking-overlay">
          <h1 className="page-title">All Bookings</h1>

          <div className="booking-list">
            {bookings.length === 0 && (
              <div className="empty">No bookings found</div>
            )}
            {bookings.map((b) => {
              const id = b._id || b.id;
              const name =
                (b.first_name || "") + (b.last_name ? " " + b.last_name : "");
              const eventName = b.package_name || b.event || "Package";
              const date = b.booking_date
                ? new Date(b.booking_date).toLocaleDateString()
                : b.date || "";
              const time = b.booking_time || "";
              const status = b.booking_status || b.status || "pending";

              return (
                <div
                  key={id}
                  className={`booking-item ${
                    status === "pending" ? "pending" : ""
                  }`}
                >
                  <div className="booking-info">
                    <div className="booking-name">{name || "Customer"}</div>
                    <div className="booking-event">{eventName}</div>
                  </div>
                  <div className="booking-meta">
                    <div className="booking-date">{date}</div>
                    <div className="booking-time">{time}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="sub-title">Pending Bookings</h2>

          <div className="booking-list">
            {bookings
              .filter((b) => (b.booking_status || b.status) === "pending")
              .map((b) => {
                const id = b._id || b.id;
                const name =
                  (b.first_name || "") + (b.last_name ? " " + b.last_name : "");
                const eventName = b.package_name || b.event || "Package";
                const date = b.booking_date
                  ? new Date(b.booking_date).toLocaleDateString()
                  : b.date || "";
                const time = b.booking_time || "";
                return (
                  <div key={id} className="booking-item pending">
                    <div className="booking-info">
                      <div className="booking-name">{name || "Customer"}</div>
                      <div className="booking-event">{eventName}</div>
                    </div>
                    <div className="booking-meta">
                      <div className="booking-date">{date}</div>
                      <div className="booking-time">{time}</div>
                    </div>
                  </div>
                );
              })}
            {bookings.filter(
              (b) => (b.booking_status || b.status) === "pending"
            ).length === 0 && <div className="empty">No pending bookings</div>}
          </div>

          <div className="booking-actions">
            <a className="action-button" href="/logout">
              Log Out
            </a>
            <button className="action-button danger">Declined</button>
          </div>
        </div>
      </main>
    </>
  );
}
