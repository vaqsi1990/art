"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import Logo from "./Logo";

const PageTransition = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const logoRef = useRef(null);
  const blocksRef = useRef([]);
  const isTransitioning = useRef(false);
  const pathLengthRef = useRef(0);
  const revealTimeoutRef = useRef(null);

  const handleRouteChange = useCallback((url) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    coverPage(url);
  }, []);

  const onAnchorClick = useCallback(
    (e) => {
      if (isTransitioning.current) {
        e.preventDefault();
        return;
      }

      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        e.currentTarget.target === "_blank"
      ) {
        return;
      }

      e.preventDefault();
      const href = e.currentTarget.href;
      const url = new URL(href).pathname;
      if (url !== pathname) {
        handleRouteChange(url);
      }
    },
    [pathname, handleRouteChange]
  );

  const revealPage = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }

    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });

    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "right",
      onComplete: () => {
        isTransitioning.current = false;
        if (overlayRef.current) {
          overlayRef.current.style.pointerEvents = "none";
        }
        if (logoOverlayRef.current) {
          logoOverlayRef.current.style.pointerEvents = "none";
        }
      },
    });

    revealTimeoutRef.current = setTimeout(() => {
      if (blocksRef.current.length > 0) {
        const firstBlock = blocksRef.current[0];
        if (firstBlock && gsap.getProperty(firstBlock, "scaleX") > 0) {
          gsap.to(blocksRef.current, {
            scaleX: 0,
            duration: 0.2,
            ease: "power2.out",
            transformOrigin: "right",
            onComplete: () => {
              isTransitioning.current = false;
              if (overlayRef.current) {
                overlayRef.current.style.pointerEvents = "none";
              }
              if (logoOverlayRef.current) {
                logoOverlayRef.current.style.pointerEvents = "none";
              }
            },
          });
        }
      }
    }, 1000);
  }, []);

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];

      for (let i = 0; i < 20; i++) {
        const block = document.createElement("div");
        block.className = "block";
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
    };

    createBlocks();

    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

    const initializeLogo = () => {
      if (!logoRef.current) return;
      
      const path = logoRef.current.querySelector("path");
      if (!path) {
        console.warn("Logo path element not found");
        return;
      }

      try {
        pathLengthRef.current = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: pathLengthRef.current,
          strokeDashoffset: pathLengthRef.current,
          fill: "transparent",
        });
      } catch (error) {
        console.error("Error initializing logo animation:", error);
      }
    };

    initializeLogo();

    revealPage();

    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener("click", onAnchorClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", onAnchorClick);
      });
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, [router, pathname, onAnchorClick, revealPage]);

  const coverPage = (url) => {
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = "auto";
    }
    if (logoOverlayRef.current) {
      logoOverlayRef.current.style.pointerEvents = "auto";
    }

    const tl = gsap.timeline({
      onComplete: () => router.push(url),
    });

    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "left",
    })

      .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2");

    // Safely animate logo path
    const logoPath = logoRef.current?.querySelector("path");
    if (logoPath && pathLengthRef.current > 0) {
      tl.set(
        logoPath,
        {
          strokeDashoffset: pathLengthRef.current,
          fill: "transparent",
        },
        "-=0.25"
      )
        .to(
          logoPath,
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          "-=0.5"
        )
        .to(
          logoPath,
          {
            fill: "#e3e4d8",
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5"
        );
    }

    tl.to(logoOverlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  return (
    <>
      <div ref={overlayRef} className="transition-overlay" aria-hidden="true" />
      <div 
        ref={logoOverlayRef} 
        className="logo-overlay"
        aria-hidden="true"
        role="presentation"
      >
        <div className="logo-container" aria-label="Page transition logo">
          <Logo ref={logoRef} />
        </div>
      </div>
      {children}
    </>
  );
};

export default PageTransition;
