"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Cursor() {
  const cursorRef = useRef(null);
  const eyeRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef(null);

  // Check if device supports mouse
  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3 });
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 0, scale: 0.8, duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Smooth cursor follow animation
  useGSAP(() => {
    if (!cursorRef.current || !isVisible) return;

    const updateCursor = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      gsap.set(cursorRef.current, {
        x: cursorPos.current.x,
        y: cursorPos.current.y,
      });

      rafRef.current = requestAnimationFrame(updateCursor);
    };

    updateCursor();
  }, { scope: cursorRef, dependencies: [isVisible] });


  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: "fixed",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "white",
      
        pointerEvents: "none",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: "translate(-50%, -50%)",
        opacity: 0,
        willChange: "transform",
      }}
    >
      <img
        ref={eyeRef}
        src="/eye.gif"
        alt="eye"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />

    </div>
  );
}
