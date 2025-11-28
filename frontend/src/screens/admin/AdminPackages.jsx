import React, { useEffect, useState } from "react";
import "./admin_packages.css";
import "../../screens/admin/admin_index.css";
import logoSrc from "../../assets/Light LocaleCafe logo.PNG";
import menuBg from "../../assets/admin-mbg.png";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = (API_URL || "").replace(/\/$/, "");

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    id: null,
    Package_name: "",
    Package_price: "",
    itemsText: "",
    is_active: true,
  });

  useEffect(() => {
    loadPackages();
  }, []);

  function handleAuthError() {
    // clear stored auth and force login
    localStorage.removeItem("token");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    alert("Session expired. Please log in again.");
    window.location.href = "/login";
  }

  async function loadPackages() {
    try {
      console.log("[AdminPackages] GET", `${baseUrl}/package`);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/package`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data;
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadPackages:", err);
      if (
        err.response?.status === 401 ||
        /invalid|expired/i.test(err.response?.data?.message || "")
      ) {
        return handleAuthError();
      }
      alert("Could not load packages: " + (err.message || err));
    }
  }

  function resetForm() {
    setForm({
      id: null,
      Package_name: "",
      Package_price: "",
      itemsText: "",
      is_active: true,
    });
  }

  function editPackage(pkg) {
    setForm({
      id: pkg._id || pkg.id || null,
      Package_name: pkg.Package_name || pkg.name || "",
      Package_price: pkg.Package_price ?? pkg.price ?? "",
      itemsText: (pkg.items && pkg.items.join("\n")) || "",
      is_active: pkg.is_active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleCreateOrUpdate(e) {
    e.preventDefault();
    const payload = {
      Package_name: form.Package_name,
      Package_price: Number(form.Package_price || 0),
      items: form.itemsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const token = localStorage.getItem("token");
      const url = form.id
        ? `${baseUrl}/package/${form.id}`
        : `${baseUrl}/package`;
      const method = form.id ? "put" : "post";

      console.log(
        "[AdminPackages] %s %s payload:",
        method.toUpperCase(),
        url,
        payload
      );

      const res = await axios[method](url, payload, {
        headers: Object.assign(
          { "Content-Type": "application/json", Accept: "application/json" },
          token ? { Authorization: `Bearer ${token}` } : {}
        ),
      });

      // success -> reload and reset
      await loadPackages();
      resetForm();
    } catch (err) {
      console.error("save package:", err);
      const msg = err.response?.data?.message || err.message || "";
      if (err.response?.status === 401 || /invalid|expired/i.test(msg)) {
        return handleAuthError();
      }
      alert("Error saving package: " + msg);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this package?")) return;
    try {
      const token = localStorage.getItem("token");
      const url = `${baseUrl}/package/${id}`;
      console.log("[AdminPackages] DELETE", url);
      await axios.delete(url, {
        headers: Object.assign(
          { Accept: "application/json" },
          token ? { Authorization: `Bearer ${token}` } : {}
        ),
      });

      await loadPackages();
      resetForm();
    } catch (err) {
      console.error("delete package:", err);
      const msg = err.response?.data?.message || err.message || "";
      if (err.response?.status === 401 || /invalid|expired/i.test(msg)) {
        return handleAuthError();
      }
      alert("Error deleting package: " + msg);
    }
  }

  return (
    <>
      <header className="header">
        <a href="/a_home" className="logo">
          <img src={logoSrc} alt="LocaleCafe logo" className="header-logo" />
        </a>

        <nav className="navibar">
          <a href="/a_home">Home</a>
          <a href="/a_packages">Packages</a>
          <button
            className="c-button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("first_name");
              localStorage.removeItem("last_name");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              localStorage.removeItem("userId");
              window.location.href = "/login";
            }}
            type="button"
          >
            <span className="label">Log Out</span>
          </button>
        </nav>
      </header>

      <main className="admin-menu-section">
        <img src={menuBg} alt="" className="menu-bg" />

        <section className="menu-overlay">
          <form className="menu-form" onSubmit={handleCreateOrUpdate}>
            <div className="form-row">
              <div className="field">
                <label>Package Name</label>
                <input
                  type="text"
                  name="Package_name"
                  value={form.Package_name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, Package_name: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label>Price (PHP)</label>
                <input
                  type="number"
                  name="Package_price"
                  step="0.01"
                  value={form.Package_price}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, Package_price: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field description">
                <label>Items (one per line)</label>
                <textarea
                  rows="6"
                  value={form.itemsText}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, itemsText: e.target.value }))
                  }
                />
              </div>

              <aside className="action-panel">
                <label>Active</label>
                <div className="toggle-wrap">
                  <input
                    id="pkg-active"
                    type="checkbox"
                    checked={Boolean(form.is_active)}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, is_active: e.target.checked }))
                    }
                  />
                  <label htmlFor="pkg-active" className="toggle"></label>
                </div>

                <div style={{ width: "100%", marginTop: 12 }}>
                  <button
                    type="submit"
                    className="action-button primary"
                    style={{ width: "100%" }}
                  >
                    {form.id ? "Update Package" : "Add Package"}
                  </button>
                  <button
                    type="button"
                    className="action-button"
                    onClick={() => resetForm()}
                    style={{ marginTop: 8, width: "100%" }}
                  >
                    Clear
                  </button>
                  {form.id && (
                    <button
                      type="button"
                      className="action-button danger"
                      style={{ marginTop: 8, width: "100%" }}
                      onClick={() => handleDelete(form.id)}
                    >
                      Delete Package
                    </button>
                  )}
                </div>
              </aside>
            </div>

            <hr style={{ border: "none", height: 18 }} />

            <h3 style={{ color: "#efe9e0", marginBottom: 12 }}>
              Existing Packages
            </h3>

            <div className="package-list">
              {packages.length === 0 && (
                <div style={{ color: "#efe9e0" }}>No packages found</div>
              )}
              {packages.map((p) => (
                <div key={p._id || p.id} className="package-card">
                  <div className="pkg-left">
                    <div className="pkg-name">{p.Package_name || p.name}</div>
                    <div className="pkg-price">
                      PHP {p.Package_price ?? p.price ?? "-"}
                    </div>
                    <div className="pkg-items">
                      {(p.items || []).slice(0, 5).map((it, i) => (
                        <div key={i} className="pkg-item">
                          • {it}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pkg-actions">
                    <button
                      className="action-button"
                      onClick={() => editPackage(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button danger"
                      onClick={() => handleDelete(p._id || p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
