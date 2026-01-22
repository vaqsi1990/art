import React from 'react';
import Logo from './Logo';
import Link from 'next/link';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container width">
        {/* Left Section - Logo */}
        <div className="footer-logo-section">
          <div className="footer-logo">
       
        
            <span className="logo-text ">ART</span></div>
        </div>

        {/* Center Section - Quick Links */}
        <div className="footer-links-section">
          <h3 className="footer-heading">Quick Links</h3>
          <div className="footer-links">
            <a href="/archive" className="footer-link">History</a>
            <a href="/artist" className="footer-link">Artist</a>
            <a href="/search" className="footer-link">Search</a>
            <a href="/help" className="footer-link">Help Center</a>
          </div>
        </div>

        {/* Right Section - Contact */}
        <div className="footer-contact-section">
          <p className="footer-contact">58 A, East Madison Street, Baltimore, MD, USA 4508</p>
          <p className="footer-contact">Mail: info@example.com</p>
          <p className="footer-contact">Phone: 000-123456789</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;