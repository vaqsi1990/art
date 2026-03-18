"use client";

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
const Footer = () => {
  const t = useTranslations('footer');
  const locale = useLocale();
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
          <h3 className="footer-heading">{t('quickLinks')}</h3>
          <div className="footer-links">
            <a href={`/${locale}/archive`} className="footer-link">{t('history')}</a>
            <a href={`/${locale}/artist`} className="footer-link">{t('artist')}</a>
            <a href={`/${locale}/search`} className="footer-link">{t('search')}</a>
            <a href={`/${locale}/help`} className="footer-link">{t('helpCenter')}</a>
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