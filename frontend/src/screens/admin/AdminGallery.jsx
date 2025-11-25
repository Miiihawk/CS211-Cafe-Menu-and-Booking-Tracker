import React from "react";
import "./admin_gallery.css";
import "../../screens/admin/admin_index.css";
import logoSrc from "../../assets/Light LocaleCafe logo.PNG";
import menuBg from "../../assets/admin-mbg.png";

export default function AdminGallery() {
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

      <main className="admin-gallery-section">
        <img src={menuBg} alt="" className="gallery-bg" />

        <section className="gallery-overlay">
          <form className="gallery-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="left-col">
                <label className="field-label">Upload Picture</label>
                <label className="upload-box">
                  <input type="file" accept="image/*" />
                  <span className="upload-placeholder">Choose image</span>
                </label>

                <label className="field-label">Description</label>
                <textarea className="description-box" name="description" />

                <label className="field-label">Category</label>
                <select className="select-input" name="category" defaultValue="">
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="breakfast">Breakfast</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                  <option value="specialty">Specialty</option>
                </select>
              </div>

              <aside className="action-panel">
                <button className="action-button primary">Add Gallery</button>
                <button className="action-button">Edit Gallery</button>
                <button className="action-button danger">Delete Gallery</button>
              </aside>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
