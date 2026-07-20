import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import logoUrl from "../assets/logo.png";

// Shared UI bits: Logo, Nav, Footer, Placeholder helpers, Section header

function Logo({ small }) {
  return (
    <div className="logo-mark" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <img
        src={logoUrl}
        alt="APAC Relocation"
        height={small ? 28 : 36}
        style={{ height: small ? 28 : 36, width: "auto", display: "block" }}
      />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="wrap nav-inner">
        <a href="#top"><Logo /></a>
        <div className="nav-cta">
          <div className="nav-contacts mono">
            <a href="mailto:contact@apacrelocation.com">contact@apacrelocation.com</a>
            <span className="nav-contacts-sep" />
            <a href="tel:+60327318420">+60 3-2731 8420</a>
            <span className="nav-contacts-sep" />
            <a
              href="https://wa.me/60123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.8-1.6-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.4 4.6.8.3 1.4.5 1.9.6.8.2 1.5.2 2.1.1.6-.1 1.7-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.3c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.8.9-3-.2-.3c-.9-1.4-1.3-3-1.3-4.6C3.6 7 7.4 3.3 12 3.3c2.2 0 4.3.9 5.9 2.5 1.6 1.6 2.5 3.7 2.5 5.9-.1 4.7-3.8 8.5-8.4 8.5z"/>
              </svg>
              +60 12-345 6789
            </a>
          </div>
          <a href="#quote-band" className="btn primary">
            Get instant quote <span className="arr">→</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function SectionHeader({ kicker, title, lede, align = "left", id }) {
  return (
    <header className={"sect-hd " + align} id={id}>
      <div className="eyebrow">{kicker}</div>
      <h2 className="h1 mt-16" style={{ maxWidth: 22 + "ch" }}>{title}</h2>
      {lede && <p className="lede mt-16">{lede}</p>}
    </header>
  );
}

function Placeholder({ label, ratio = "wide", corner, children, style }) {
  return (
    <div className={"placeholder ratio-" + ratio} style={style}>
      {corner && <div className="corner"><i />{corner}</div>}
      {children}
      <span>{label}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p className="muted mt-16" style={{ maxWidth: 36 + "ch", fontSize: 14 }}>
              A licensed door-to-door relocation partner moving Malaysians to Australia, the
              UK, Canada, Singapore, and the US since 2014.
            </p>
            <div className="mt-24 mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em" }}>
              FIDI · IAM · SSM Licensed Forwarder
            </div>
          </div>
          <div>
            <div className="footer-h">Services</div>
            <ul>
              <li><a href="#services">Door-to-door moves</a></li>
              <li><a href="#services">Air freight</a></li>
              <li><a href="#services">Sea freight</a></li>
              <li><a href="#services">Customs &amp; clearance</a></li>
              <li><a href="#services">Pet relocation</a></li>
              <li><a href="#services">Settling-in services</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-h">Company</div>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Partners</a></li>
              <li><a href="#">Insurance</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-h">Kuala Lumpur HQ</div>
            <ul className="muted">
              <li>Level 21, Menara APAC</li>
              <li>Jalan Sultan Ismail</li>
              <li>50250 Kuala Lumpur</li>
              <li className="mt-8">contact@apacrelocation.com</li>
              <li>+60 3-2731 8420</li>
              <li>WhatsApp +60 12-345 6789</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.06em" }}>
            © 2026 APAC RELOCATION SDN BHD · www.apacrelocation.com
          </div>
          <div className="footer-meta mono">
            <span>Privacy</span>
            <span>·</span>
            <span>Terms</span>
            <span>·</span>
            <span>Modern slavery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Logo, Nav, SectionHeader, Placeholder, Footer };
