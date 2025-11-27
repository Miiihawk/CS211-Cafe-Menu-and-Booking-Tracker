import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user_booking.css";
import bookingBG from "../../assets/Bookingbg.png";

export default function UserBooking() {
  const navigate = useNavigate();

  const packages = [
    {
      id: 1,
      name: "Package 1",
      price: 8100,
      items: [
        "30 Brewed Coffee (Any Flavour of Choice)",
        "Spanish Latte",
        "Caramel Macchiato",
        "Chocolate Mocha",
        "20 Non Caffeine Drinks (Any Flavour)",
        "Brown Sugar Milktea",
        "Brown Sugar Milo Rawr",
        "Strawberry Latte",
      ],
    },
    {
      id: 2,
      name: "Package 2",
      price: 6400,
      items: [
        "50 Brewed Coffee (Any Flavour of Choice)",
        "Spanish Latte",
        "Caramel Macchiato",
        "Chocolate Mocha",
      ],
    },
    {
      id: 3,
      name: "Package 3",
      price: 7600,
      items: [
        "50 Non Caffeine Drinks (Any Flavour)",
        "Brown Sugar Milktea",
        "Brown Sugar Milo Rawr",
        "Strawberry Latte",
      ],
    },
  ];

  const [form, setForm] = useState({
    eventAddress: "",
    firstName: "",
    lastName: "",
    phone: "",
    eventDate: "",
    pkgId: 1,
    quantity: 1,
    payment: "cod",
  });

  const shippingFee = 75;
  const handlingFee = 60;

  const selectedPackage =
    packages.find((p) => p.id === Number(form.pkgId)) || packages[0];
  const merchandiseSubtotal = selectedPackage.price * Number(form.quantity);
  const totalPayment = merchandiseSubtotal + shippingFee + handlingFee;

  function update(field, asNumber = false) {
    return (e) => {
      const raw = e?.target?.value;
      const value = asNumber ? Number(raw || 0) : raw;
      setForm((s) => ({ ...s, [field]: value }));
    };
  }

  function handlePackageSelect(id) {
    setForm((s) => ({ ...s, pkgId: id }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.eventAddress?.trim()) {
      alert("Please enter event address");
      return;
    }
    if (!form.eventDate) {
      alert("Please select event date");
      return;
    }
    if (!form.firstName?.trim() || !form.lastName?.trim()) {
      alert("Please enter full name");
      return;
    }
    if (!form.phone?.trim()) {
      alert("Please enter phone");
      return;
    }

    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("userId") || undefined;
    const baseUrl = import.meta?.env?.VITE_API_URL || "http://localhost:3000";
    const url = `${baseUrl.replace(/\/$/, "")}/bookings`;
    const payload = {
      customer_id: customerId,
      package_id: Number(form.pkgId),
      quantity: Number(form.quantity),
      merchandise_subtotal: Number(merchandiseSubtotal),
      shipping_fee: Number(shippingFee),
      handling_fee: Number(handlingFee),
      total_amount: Number(totalPayment),
      payment_method: form.payment,
      payment_status: "pending",
      status: "pending",
      event_address: form.eventAddress,
      booking_date: form.eventDate, // backend will parse to Date
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      notes: "",
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: Object.assign(
          { "Content-Type": "application/json" },
          token ? { Authorization: `Bearer ${token}` } : {}
        ),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Booking error:", data);
        alert(`Error: ${data.message || JSON.stringify(data)}`);
        return;
      }

      alert("Booking created successfully.");
      // redirect to user dashboard or bookings list
      navigate("/home");
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error while creating booking.");
    }
  }

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
                  key={p.id}
                  type="button"
                  className={`package-card ${
                    Number(form.pkgId) === p.id ? "active" : ""
                  }`}
                  onClick={() => handlePackageSelect(p.id)}
                >
                  <div className="pkg-name">{p.name}</div>
                  <div className="pkg-price">Price: PHP {p.price}</div>
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
                  setForm((s) => ({ ...s, pkgId: Number(e.target.value) }))
                }
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="summary-row">
              <label>Unit Price:</label>
              <div>{selectedPackage.price}</div>
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
              <label
                className={`payment-option ${
                  form.payment === "cod" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={form.payment === "cod"}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, payment: e.target.value }))
                  }
                />
                <span>Cash on Delivery</span>
              </label>

              <label
                className={`payment-option ${
                  form.payment === "card" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={form.payment === "card"}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, payment: e.target.value }))
                  }
                />
                <span>Credit/ Debit Card</span>
              </label>

              <label
                className={`payment-option ${
                  form.payment === "gcash" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="gcash"
                  checked={form.payment === "gcash"}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, payment: e.target.value }))
                  }
                />
                <span>Gcash</span>
              </label>
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
