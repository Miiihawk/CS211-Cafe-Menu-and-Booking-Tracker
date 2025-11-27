import React from "react";
import "./admin_menu.css";
import "../../screens/admin/admin_index.css";
import logoSrc from "../../assets/Light LocaleCafe logo.PNG";
import menuBg from "../../assets/admin-mbg.png";

export default function AdminMenu() {
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

      <main className="admin-menu-section">
        <img src={menuBg} alt="" className="menu-bg" />

        <section className="menu-overlay">
          <form className="menu-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="field">
                <label>Item Name</label>
                <input type="text" name="name" />
              </div>

              <div className="field">
                <label>Upload Picture</label>
                <label className="upload-btn">
                  <input type="file" accept="image/*" />
                  Choose image
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Category</label>
                <input type="text" name="category" />
              </div>

              <div className="field">
                <label>Availability</label>
                <div className="toggle-wrap">
                  <input id="avail" type="checkbox" />
                  <label htmlFor="avail" className="toggle"></label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Price</label>
                <input type="number" name="price" step="0.01" />
              </div>

              <div className="field empty">&nbsp;</div>
            </div>

            <div className="form-row">
              <div className="field description">
                <label>Description</label>
                <textarea rows="8" name="description" />
              </div>

              <aside className="action-panel">
                <button className="action-button primary">Add Menu Item</button>
                <button className="action-button">Edit Menu Item</button>
                <button className="action-button danger">
                  Delete Menu Item
                </button>
              </aside>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
