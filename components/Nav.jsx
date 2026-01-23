"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Nav = () => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-section");
      if (!heroSection) {
        return;
      }

      const rect = heroSection.getBoundingClientRect();
      // Check if hero section has scrolled past the top of viewport
      // rect.bottom is the distance from top of viewport to bottom of hero
      // If it's <= 0, hero has scrolled past
      const scrolledPast = rect.bottom <= 0;
      setIsScrolledPastHero(scrolledPast);
    };

    // Use requestAnimationFrame for smoother performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Check after component mounts and DOM is ready
    // Use multiple timeouts to ensure hero section is loaded
    const checkHero = () => {
      const heroSection = document.querySelector(".hero-section");
      if (heroSection) {
        handleScroll();
      } else {
        setTimeout(checkHero, 50);
      }
    };
    
    setTimeout(checkHero, 100);
    setTimeout(checkHero, 500);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.burger-menu-btn')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={isScrolledPastHero ? "nav-scrolled" : ""}
        style={{
          backgroundColor: isScrolledPastHero ? "#fae9d3 " : "transparent",
          transition: "background-color 0.3s ease",
        }}
      >
        <div className="width flex justify-between items-center">
        <div className="nav-logo">
          <Link href="/">Art</Link>
        </div>

        <div className="nav-links">
          <Link className="text-[20px]" href="/">Home</Link>
          <Link className="text-[20px]" href="/about">About</Link>
          <Link className="text-[20px]" href="/contact">Contact</Link>
          <Link className="text-[20px]" href="/shop">Shop</Link>
          <Link className="text-[20px]" href="/cart">Cart</Link>
        </div>

        <button 
          className="burger-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button 
          className="mobile-menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <span></span>
          <span></span>
        </button>
        <div className="mobile-menu-links">
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/about" onClick={closeMenu}>About</Link>
          <Link href="/contact" onClick={closeMenu}>Contact</Link>
          <Link href="/shop" onClick={closeMenu}>Shop</Link>
          <Link href="/cart" onClick={closeMenu}>Cart</Link>
        </div>
      </div>
    </>
  );
};

export default Nav;
