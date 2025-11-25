import React from "react";
import "./admin_booking.css";
import "./admin_index.css";
import logoSrc from "../../assets/Light LocaleCafe logo.PNG";
import bg from "../../assets/admin-mbg.png";

export default function AdminBooking() {
    async function handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("username");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }

  const bookings = [
    {
      id: 1,
      name: "Smith Family",
      event: "Birthday Party",
      date: "2025-12-05",
      time: "18:00",
      status: "confirmed",
    },
    {
      id: 2,
      name: "Jones",
      event: "Anniversary",
      date: "2025-12-12",
      time: "19:30",
      status: "pending",
    },
    {
      id: 3,
      name: "Garcia",
      event: "Corporate",
      date: "2025-12-20",
      time: "12:00",
      status: "confirmed",
    },
  ];

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
            {bookings.map((b) => (
              <div
                key={b.id}
                className={`booking-item ${
                  b.status === "pending" ? "pending" : ""
                }`}
              >
                <div className="booking-info">
                  <div className="booking-name">{b.name}</div>
                  <div className="booking-event">{b.event}</div>
                </div>
                <div className="booking-meta">
                  <div className="booking-date">{b.date}</div>
                  <div className="booking-time">{b.time}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="sub-title">Pending Bookings</h2>

          <div className="booking-list">
            {bookings
              .filter((b) => b.status === "pending")
              .map((b) => (
                <div key={b.id} className="booking-item pending">
                  <div className="booking-info">
                    <div className="booking-name">{b.name}</div>
                    <div className="booking-event">{b.event}</div>
                  </div>
                  <div className="booking-meta">
                    <div className="booking-date">{b.date}</div>
                    <div className="booking-time">{b.time}</div>
                  </div>
                </div>
              ))}
            {bookings.filter((b) => b.status === "pending").length === 0 && (
              <div className="empty">No pending bookings</div>
            )}
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
