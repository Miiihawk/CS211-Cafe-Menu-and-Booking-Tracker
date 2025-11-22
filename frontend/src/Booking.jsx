import React from 'react'
import logoSrc from "./assets/Light LocaleCafe logo.PNG";

function Booking() {
    return (
        <header className="header">
                <a href="/" className="logo">
                  <img src={logoSrc} alt="LocaleCafe logo" className="header-logo" />
                </a>
        
                <nav className="navibar">
                  <p
                    id="for-the-selection-button-3"
                    className="for-the-selection-button-3"
                  />
                  <a href="/">Home</a>
                  <a href="/booking">Book</a>
                  <a href="/menu">Menu</a>
                  <a href="/gallery">Gallery</a>
                  <a className="c-button" href="/login">
                    <span className="label">Log In</span>
                  </a>
                </nav>
              </header>
    )
}

export default Booking