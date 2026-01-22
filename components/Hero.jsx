"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import Copy from "./Copy";

export default function Hero() {
  const heroRef = useRef(null);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const buttonRef = useRef(null);
  const imageTimelineRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("/img_01.jpg");

  useGSAP(() => {
    if (!heroRef.current) return;

    // Set initial states explicitly
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { opacity: 0, scale: 0.9 });
    }

    // Animate hero elements on load
    const tl = gsap.timeline();
    
    tl.from(".hero-title", {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    })
    .from(".hero-description", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.5");
    
    // Animate button with explicit target
    if (buttonRef.current) {
      tl.to(buttonRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }, "-=0.3");
    }
  
    tl.from(".carousel-item", {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
    }, "-=0.4");
  }, { scope: heroRef });

  const scrollCarousel = (direction) => {
    if (!trackRef.current) return;
    // Get the first carousel item to calculate width
    const firstItem = trackRef.current.querySelector('.carousel-item');
    if (!firstItem) return;
    
    const itemWidth = firstItem.offsetWidth;
    const gap = 16; // 1rem = 16px
    const scrollAmount = itemWidth + gap;
    
    const currentScroll = trackRef.current.scrollLeft;
    const maxScroll = trackRef.current.scrollWidth - trackRef.current.clientWidth;
    
    let newScroll;
    if (direction === 'next') {
      newScroll = Math.min(currentScroll + scrollAmount, maxScroll);
    } else {
      newScroll = Math.max(0, currentScroll - scrollAmount);
    }
    
    trackRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  const handleImageSelect = (imageSrc, event) => {
    if (!event || !backgroundImageRef.current || selectedImage === imageSrc) return;
    
    // Kill previous animation if it's still running
    if (imageTimelineRef.current) {
      imageTimelineRef.current.kill();
      imageTimelineRef.current = null;
    }
    
    const clickedItem = event.currentTarget;
    const clickedImage = clickedItem.querySelector('img');
    
    if (!clickedImage) return;
    
    // Animate carousel item - remove grayscale
    gsap.to(clickedImage, {
      filter: "grayscale(0%)",
      duration: 0.4,
      ease: "power2.out",
    });
    
    // Reset other items to grayscale
    const allItems = trackRef.current?.querySelectorAll('.carousel-item');
    if (allItems) {
      allItems.forEach((item) => {
        if (item !== clickedItem) {
          const img = item.querySelector('img');
          if (img) {
            gsap.to(img, {
              filter: "grayscale(100%)",
              duration: 0.4,
              ease: "power2.out",
            });
          }
        }
      });
    }
    
    // Change background image with fade effect (no scale)
    setSelectedImage(imageSrc);
    
    const tl = gsap.timeline();
    imageTimelineRef.current = tl;
    
    // Fade out
    tl.to(backgroundImageRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    })
    // Change image
    .call(() => {
      if (backgroundImageRef.current) {
        backgroundImageRef.current.style.backgroundImage = `url(${imageSrc})`;
      }
    })
    // Fade in
    .to(backgroundImageRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        imageTimelineRef.current = null;
      }
    });
  };

  return (
    <div ref={heroRef} className="hero-section">
      {/* Background Image */}
      <div className="hero-background">
        <div 
          ref={backgroundImageRef}
          className="hero-background-image"
          style={{
            backgroundImage: `url(${selectedImage})`,
          }}
        ></div>
        <div className="hero-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="hero-content">
        <div className="hero-text">
          <Copy delay={0.5} animateOnScroll={false}>
            <h1 className="hero-title text-[20px] md:text-[30px]">
             დატკბლით ხელოვნების <br /> <span className="">ნიმუშებით</span>
            </h1>
          </Copy>
          
          
          <Link href="/shop">
            <button ref={buttonRef} className="hero-button md:text-[20px] text-[18px] z-10">
             ჩვენი კოლექცია 
            </button>
          </Link>
          
        </div>
      </div>

    

      {/* Image Carousel - Bottom */}
      <div className="carousel-container" ref={carouselRef}>
        <button 
          className="carousel-nav carousel-prev"
          onClick={() => scrollCarousel('prev')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="carousel-track" ref={trackRef}>
          <div 
            className="carousel-item"
            onClick={(e) => handleImageSelect("/img_01.jpg", e)}
          >
            <img src="/img_01.jpg" alt="Artwork 1" />
          </div>
          <div 
            className="carousel-item"
            onClick={(e) => handleImageSelect("/img_02.jpg", e)}
          >
            <img src="/img_02.jpg" alt="Artwork 2" />
          </div>
          <div 
            className="carousel-item"
            onClick={(e) => handleImageSelect("/img_03.jpg", e)}
          >
            <img src="/img_03.jpg" alt="Artwork 3" />
          </div>
          <div 
            className="carousel-item"
            onClick={(e) => handleImageSelect("/img_04.jpg", e)}
          >
            <img src="/img_04.jpg" alt="Artwork 4" />
          </div>
          
        </div>
        
        <button 
          className="carousel-nav carousel-next"
          onClick={() => scrollCarousel('next')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
