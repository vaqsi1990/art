"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const Nav = () => {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
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

  const switchLocale = (nextLocale) => {
    if (!pathname) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${nextLocale}`);
      return;
    }

    if (segments[0] === "en" || segments[0] === "ka") {
      segments[0] = nextLocale;
      router.push("/" + segments.join("/"));
      return;
    }

    router.push(`/${nextLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`);
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
          <Link href={`/${locale}`}>{t("brand")}</Link>
        </div>

        <div className="nav-links">
          <Link className="text-[20px]" href={`/${locale}`}>{t("home")}</Link>
          <Link className="text-[20px]" href={`/${locale}/about`}>{t("about")}</Link>
          <Link className="text-[20px]" href={`/${locale}/contact`}>{t("contact")}</Link>
          <Link className="text-[20px]" href={`/${locale}/shop`}>{t("gallery")}</Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => switchLocale("ka")}
              className={`text-[14px] ${isScrolledPastHero ? "text-black" : "text-white"}`}
              aria-label="Switch to Georgian"
              style={{ opacity: locale === "ka" ? 1 : 0.6 }}
            >
              KA
            </button>
            <span
              className={`${isScrolledPastHero ? "text-black" : "text-white"}`}
              style={{ opacity: 0.7 }}
            >
              /
            </span>
            <button
              type="button"
              onClick={() => switchLocale("en")}
              className={`text-[14px] ${isScrolledPastHero ? "text-black" : "text-white"}`}
              aria-label="Switch to English"
              style={{ opacity: locale === "en" ? 1 : 0.6 }}
            >
              EN
            </button>
          </div>
         
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
          <Link href={`/${locale}`} onClick={closeMenu}>{t("home")}</Link>
          <Link href={`/${locale}/about`} onClick={closeMenu}>{t("about")}</Link>
          <Link href={`/${locale}/contact`} onClick={closeMenu}>{t("contact")}</Link>
          <Link href={`/${locale}/shop`} onClick={closeMenu}>{t("gallery")}</Link>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                switchLocale("ka");
                closeMenu();
              }}
              className="text-white"
              style={{ opacity: locale === "ka" ? 1 : 0.75 }}
            >
              KA
            </button>
            <button
              type="button"
              onClick={() => {
                switchLocale("en");
                closeMenu();
              }}
              className="text-white"
              style={{ opacity: locale === "en" ? 1 : 0.75 }}
            >
              EN
            </button>
          </div>
    
        </div>
      </div>
    </>
  );
};

export default Nav;
