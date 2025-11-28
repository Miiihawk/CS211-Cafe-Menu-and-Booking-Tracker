import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./user_booking.css";
import bookingBG from "../../assets/Bookingbg.png";
import axios from "axios";

export default function UserBooking() {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    eventAddress: "",
    eventDate: "",
    pkgId: null,
    quantity: 1,
    payment: "cod",
  });

  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({ price: 0 });

  const shippingFee = 100; // example
  const handlingFee = 50; // example

  // Calculates selected package
  const Packages = packages.find((p) => p._id === form.pkgId);

  // Calculate subtotal safely
  const merchandiseSubtotal = Packages
    ? selectedPackage.Package_price * form.quantity
    : 0;

  const totalPayment = merchandiseSubtotal + shippingFee + handlingFee;

  // Fetch packages from backend
  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await axios.get(`${API_URL}/package`);
        setPackages(res.data);
        if (res.data.length > 0) {
          setForm((s) => ({ ...s, pkgId: res.data[0]._id }));
          setSelectedPackage(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchPackages();
  }, [API_URL]);

  // Update selectedPackage whenever pkgId changes
  useEffect(() => {
    const pkg = packages.find((p) => p._id === form.pkgId);
    if (pkg) setSelectedPackage(pkg);
  }, [form.pkgId, packages]);

  // Handle input changes
  const update = (field) => (e) => {
    setForm((s) => ({ ...s, [field]: e.target.value }));
  };

  // Select package
  const handlePackageSelect = (id) => {
    setForm((s) => ({ ...s, pkgId: id }));
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/booking`,
        {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          payment_method: form.payment,
          event_address: form.eventAddress,
          package_id: form.pkgId,
          booking_date: form.eventDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking created successfully");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create booking");
    }
  };

  return (
    <div
      className="booking-page-wrapper"
      style={{ backgroundImage: `url(${bookingBG})` }}
    >
      <div className="booking-hero">
        <h1 className="booking-title">New Reservation</h1>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="booking-left">
          <div className="panel event-address-bar">
            <div className="event-address-left">
              <span className="event-address-title">Event Address</span>
              <input
                className="input"
                value={form.eventAddress}
                onChange={update("eventAddress")}
              />
            </div>
          </div>

          <div className="panel">
            <div className="input-label">Event Date</div>
            <input
              className="input"
              type="date"
              value={form.eventDate}
              onChange={update("eventDate")}
              required
            />
          </div>

          <div className="row split">
            <div className="panel">
              <div className="input-label">First Name</div>
              <input
                className="input"
                value={form.firstName}
                onChange={update("firstName")}
              />
            </div>
            <div className="panel">
              <div className="input-label">Last Name</div>
              <input
                className="input"
                value={form.lastName}
                onChange={update("lastName")}
              />
            </div>
            <div className="panel wide">
              <div className="input-label">Phone Number</div>
              <input
                className="input"
                value={form.phone}
                onChange={update("phone")}
              />
            </div>
          </div>

          <div className="packages">
            <div className="package-cards">
              {packages.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  className={`package-card ${
                    form.pkgId === p._id ? "active" : ""
                  }`}
                  onClick={() => handlePackageSelect(p._id)}
                >
                  <div className="pkg-name">{p.Package_name}</div>
                  <div className="pkg-price">Price: PHP {p.Package_price}</div>
                  <div className="pkg-details">
                    <ul>
                      {p.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-right">
          <div className="panel order-summary">
            <h3 className="panel-title">Product Ordered</h3>
            <div className="summary-row">
              <label>Package Type:</label>
              <select
                value={form.pkgId}
                onChange={(e) =>
                  setForm((s) => ({ ...s, pkgId: e.target.value }))
                }
              >
                {packages.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.Package_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="summary-row">
              <label>Unit Price:</label>
              <div>{selectedPackage.Package_price}</div>
            </div>

            <div className="summary-row">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                className="qty"
                value={form.quantity}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    quantity: Number(e.target.value || 1),
                  }))
                }
              />
            </div>

            <div className="summary-row">
              <label>Subtotal:</label>
              <div>{merchandiseSubtotal}</div>
            </div>
          </div>

          <div className="panel payment-methods">
            <h3 className="panel-title">Payment Method</h3>
            <div className="payment-grid">
              {["cod", "card", "gcash"].map((method) => (
                <label
                  key={method}
                  className={`payment-option ${
                    form.payment === method ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={form.payment === method}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, payment: e.target.value }))
                    }
                  />
                  <span>
                    {method === "cod"
                      ? "Cash on Delivery"
                      : method === "card"
                      ? "Credit/ Debit Card"
                      : "Gcash"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="panel totals-panel">
            <div className="fee-row">
              <label>Merchandise Subtotal:</label>
              <div>{merchandiseSubtotal}</div>
            </div>
            <div className="fee-row">
              <label>Shipping Fee:</label>
              <div>{shippingFee}</div>
            </div>
            <div className="fee-row">
              <label>Handling Fee:</label>
              <div>{handlingFee}</div>
            </div>
            <div className="fee-row grand">
              <label>Total Payment:</label>
              <div>{totalPayment}</div>
            </div>

            <div className="actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => navigate("/home")}
              >
                Back to Home
              </button>
              <button type="submit" className="btn primary">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
