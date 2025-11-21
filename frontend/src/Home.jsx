import React from "react";
import "./index.css";
import logoSrc from "./assets/Dark LocaleCafe logo.PNG";
import footerSrc from "./assets/Footer.PNG";
import { Link } from "react-router-dom";

const Home = (props) => {
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
          <a href="/">Home</a>
          <a href="/booking">Book</a>
          <a href="/menu">Menu</a>
          <a href="/gallery">Gallery</a>
          <a className="c-button" href="/login">
            <span className="label">Log In</span>
          </a>
        </nav>
      </header>

      <div className="front-page-hero">
        <div className="front-page-textcontent1">
          <div className="front-page-textandlinks">
            <div className="front-page-buttons1">
              <span className="front-page-text13 Headline1">
                Where Coffee meets Locale
              </span>
              <span className="front-page-text14">Locale Cafe</span>
              <span className="front-page-text15">Coffee &amp; Waffles</span>
            </div>

            <div className="front-page-button-row">
              <Link to="/booking" className="front-page-button11">
                <span className="front-page-text16">Book</span>
              </Link>
              <Link to="/menu" className="front-page-button21">
                <span className="front-page-text17">Menu</span>
              </Link>
            </div>
          </div>

          <div className="front-page-openingtimes">
            <div className="front-page-addressandhours">
              <div className="front-page-address">
                <span className="front-page-text18">
                  Nielsen St., Norville Subdivision
                </span>
                <span className="front-page-text19">
                  La Vista - Pansol Resort Complex
                </span>
              </div>
              <div className="front-page-hours">
                <div className="front-page-frame21472334941">
                  <span className="front-page-text20">
                    <span className="front-page-date">Monday : 8am – 11pm</span>
                    <br />
                    <span className="front-page-date">
                      Tuesday : 8am – 11pm
                    </span>
                    <br />
                    <span className="front-page-date">
                      Wednesday : 8am – 11pm
                    </span>
                    <br />
                    <span className="front-page-date">
                      Thursday : 8am – 11pm
                    </span>
                    <br />
                    <span className="front-page-date">Friday : 8am – 11pm</span>
                    <br />
                    <span className="front-page-date">
                      Saturday : 8am – 11pm
                    </span>
                    <br />
                    <span className="front-page-date">Sunday : Closed</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <img
          src="/image4761583115484411448856575193793752551072770n16382-2uu-700h.png"
          alt="hero"
          className="front-page-image4761583115484411448856575193793752551072770n1"
        />
      </div>

      <div className="front-page-main">
        <div className="front-page-headline1">
          <img
            src="/image48664356030941238574061092220502136853509516n6382-y72j-500h.png"
            alt="headline"
            className="front-page-image48664356030941238574061092220502136853509516n"
          />
          <img
            src="/spacer6383-i385-200h.png"
            alt="spacer"
            className="front-page-spacer"
          />
          <span className="front-page-text34">
            Locale Cafe is a family owned restaurant where it serves different
            flavors of coffee from different cities and country. They also serve
            delicious waffles catering all age groups to satisfy your cravings.
          </span>
        </div>

        <div className="front-page-menu">
          <div className="front-page-title">
            <span className="front-page-text35">Booking and Events</span>
          </div>
          <div className="front-page-starters">
            <span className="front-page-text36">Birthday Party</span>
            <span className="front-page-text37">
              Locale Cafe is a family owned restaurant where it serves different
              flavors of coffee from different cities and country. They also
              serve delicious waffles catering all age groups to satisfy your
              cravings.
            </span>
            <img
              src="/image4919234496046220892675623046731925482577444n16383-2nji-700h.png"
              alt="event"
              className="front-page-image4919234496046220892675623046731925482577444n1"
            />
          </div>
        </div>
      </div>

      <footer className="front-page-footer">
        <img src={footerSrc} alt="Footer background" className="footer-img" />
        <div className="front-page-innercontent front-page-footer-content">
          <div className="front-page-textcontent3">
            <div className="front-page-frame2147236495">
              <span className="front-page-text41 Paragraph">
                A classic bistro influence, respect for what the changing
                seasons and our dedicated suppliers are offering, comforting
                dishes that work with wine.
              </span>
            </div>
            <div className="front-page-frame2147233497">
              <div className="front-page-frame2147233489">
                <span className="front-page-text42 Caption">
                  Nielsen St., Norville Subdivision La Vista - Pansol Resort
                  Complex
                </span>
              </div>
              <div className="front-page-frame21472334942">
                <span className="front-page-text44 Caption">
                  <span>Monday : 8am – 11pm</span>
                  <br />
                  <span>Tuesday : 8am – 11pm</span>
                  <br />
                  <span>Wednesday : 8am – 11pm</span>
                  <br />
                  <span>Thursday : 8am – 11pm</span>
                  <br />
                  <span>Friday : 8am – 11pm</span>
                  <br />
                  <span>Saturday : 8am – 11pm</span>
                  <br />
                  <span>Sunday : Closed</span>
                </span>
              </div>
            </div>
          </div>
          <div className="front-page-wordmarkandlegl">
            <div className="front-page-legalinfo">
              <span className="front-page-text58 Caption">
                © La Vista Pansol Resort Complex 2024
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
