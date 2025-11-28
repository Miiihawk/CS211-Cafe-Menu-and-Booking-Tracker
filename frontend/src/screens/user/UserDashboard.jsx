import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../index.css";
import "./user_index.css";
import logoSrc from "../../assets/Light LocaleCafe logo.PNG";
import heroBg from "../../assets/Welcome.png";
import footerBg from "../../assets/Footer.PNG";
import coffeeImg from "../../assets/coffee-sample.PNG";
import axios from "axios";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const eventsBoxStyle =
    bookings.length === 0
      ? {
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
        }
      : { minHeight: 220, maxHeight: 380, overflowY: "auto", padding: 12 };

  const menuItems = new Array(3).fill(0).map((_, i) => ({
    id: i + 1,
    name: "Name",
    price: "$ Price",
    img: coffeeImg,
  }));

  const gallery = [
    "../../assets/gallery1.PNG",
    "../../assets/gallery2.PNG",
    "../../assets/gallery3.PNG",
  ];

  const first_name = localStorage.getItem("first_name") || "";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        console.log("Bookings fetched:", response.data);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  async function handleLogout() {
    // Check if user is logged in

    try {
      const accessToken = localStorage.getItem("token");

      console.log(localStorage.getItem("token"));

      await axios.post(
        `${import.meta.env.VITE_API_URL}/authentication/logout`,
        {}, // no body needed
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true, // send cookie too
        }
      );

      // Clear localStorage
      localStorage.clear();

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:");
      alert("Logout failed. Please try again.");
    }
  }

  return (
    <>
      <header className="header">
        <a href="/" className="logo">
          <img src={logoSrc} alt="LocaleCafe logo" className="header-logo" />
        </a>

        <nav className="navibar">
          <p
            id="for-the-selection-button-3"
            className="for-the-selection-button-3"
          />
          <a href="#hero">Home</a>
          <a href="#bookings-section">Book</a>
          <a href="#menu-section">Menu</a>
          <a href="#gallery-section">Gallery</a>
          <button className="c-button" onClick={handleLogout} type="button">
            <span className="label">Log Out</span>
          </button>
        </nav>
      </header>

      <main className="user-dashboard">
        <div
          id="hero"
          className="hero"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="hero-inner">
            <h1 className="welcome">Welcome Back, {first_name}!</h1>
            <p className="subtitle">How can we help you today?</p>

            <div className="top-row">
              <div className="announcement">
                <div className="ann-title">Announcement Board</div>
                <div className="ann-body"></div>
              </div>
            </div>
          </div>
        </div>

        <section id="menu-section" className="menu-section">
          <h2 className="section-title">Menu</h2>
          <div className="menu-container">
            <button className="nav-arrow left">&lt;</button>
            <div className="menu-grid">
              {menuItems.map((m) => (
                <div key={m.id} className="menu-card">
                  <div
                    className="menu-img"
                    style={{ backgroundImage: `url(${m.img})` }}
                  ></div>
                  <div className="menu-meta">
                    <div className="menu-name">{m.name}</div>
                    <div className="menu-price">{m.price}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="nav-arrow right">&gt;</button>
          </div>
        </section>

        <section id="bookings-section" className="bookings-section">
          <h2 className="section-title">Bookings & Events</h2>
          <div className="bookings-container">
            <div className="your-events">
              <div className="small-label">Your Events</div>
              <div className="events-box" style={eventsBoxStyle}>
                {bookings.length === 0 ? (
                  <p style={{ margin: 0, color: "#efe9e0" }}>
                    No bookings yet.
                  </p>
                ) : (
                  bookings.map((b, idx) => (
                    <div key={b._id || idx} className="event-wrapper">
                      <div className="event-card">
                        <div className="event-card-inner">
                          <div className="event-main">
                            <h4 className="evt-title">
                              {b.package_name || "Package"}
                            </h4>
                            <div className="evt-meta">
                              <span className="evt-status">
                                Status: {b.booking_status}
                              </span>
                              <span className="evt-date">
                                {new Date(b.booking_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="evt-address">
                              Address: {b.event_address}
                            </div>
                          </div>
                          <div className="event-side">
                            <div className="evt-total">₱{b.total_amount}</div>
                            <button
                              className="evt-action"
                              onClick={() => navigate(`/u_booking/${b._id}`)}
                              type="button"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* separator between bookings */}
                      {idx < bookings.length - 1 && (
                        <div className="event-separator" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="book-button-wrap">
              <Link to="/u_booking" className="user-action-button">
                Make New Reservation
              </Link>
            </div>
          </div>
        </section>

        <section id="gallery-section" className="gallery-section">
          <h2 className="section-title">The Gallery</h2>
          <div className="gallery-strip">
            {gallery.map((g, i) => (
              <div
                key={i}
                className="gallery-item"
                style={{ backgroundImage: `url(${g})` }}
              ></div>
            ))}
          </div>
          <div className="gallery-dots">
            {gallery.map((_, i) => (
              <span key={i} className={`dot ${i === 0 ? "active" : ""}`}></span>
            ))}
          </div>
        </section>

        <footer className="dashboard-footer">
          <img src={footerBg} alt="footer" className="footer-bg" />
          <div className="footer-content">
            <div className="footer-left">
              <h3 className="brand">Locale Cafe</h3>
              <p className="tagline">Coffee & Waffles</p>

              <div className="footer-address">
                <p>Nielsen St., Norville Subdivision</p>
                <p>La Vista - Pansol Resort Complex</p>
              </div>

              <div className="footer-hours">
                <div className="hours-row">
                  <span className="day">Mon-Wed</span>
                  <span className="time">5pm-8pm</span>
                </div>
                <div className="hours-row">
                  <span className="day">Thu</span>
                  <span className="time">5pm-10pm</span>
                </div>
                <div className="hours-row">
                  <span className="day">Fri-Sat</span>
                  <span className="time">5pm-Late</span>
                </div>
              </div>
            </div>

            <div className="footer-right">
              <p className="footer-desc">
                At Locale Cafe, we believe that great coffee deserves an equally
                great atmosphere. Situated in La Vista Pansol Resort Complex,
                our café provides a comfortable and inviting space for guests to
                enjoy freshly brewed drinks and handcrafted waffles.
              </p>

              <p className="footer-desc">
                We offer a convenient and relaxing stop for anyone looking to
                unwind, meet friends, or simply take a moment for themselves.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>©2025 |&nbsp;&nbsp;All Rights Reserved | Locale Cafe</p>
          </div>
        </footer>
      </main>
    </>
  );
}
