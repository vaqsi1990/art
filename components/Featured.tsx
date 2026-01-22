"use client";

import React, { useRef, useState, useEffect } from 'react'
import { artworks } from '@/data/artworks'
import { useRouter } from 'next/navigation'

const Featured = () => {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const cardImageRef = useRef<HTMLDivElement>(null)
  const cardTitleRef = useRef<HTMLHeadingElement>(null)
  const cardSubtitleRef = useRef<HTMLHeadingElement>(null)
  const cardLeadRef = useRef<HTMLParagraphElement>(null)
  const cardTextRef = useRef<HTMLDivElement>(null)
  
  // Get featured artworks (highest priced)
  const featuredArtworks = artworks
    .filter(a => a.price > 1000)
    .slice(0, 3)
    .concat(artworks.filter(a => a.price <= 1000).slice(0, 1))
    .slice(0, 3)

  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const interval = 5000

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if button was clicked
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    router.push(`/products/${featuredArtworks[activeIndex]?.id}`)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push('/shop')
  }

  useEffect(() => {
    if (!cardImageRef.current || !cardTitleRef.current || !cardSubtitleRef.current || !cardLeadRef.current || !cardTextRef.current) return

    // Set initial content
    const updateContent = (index: number) => {
      if (!cardImageRef.current || !cardTitleRef.current || !cardSubtitleRef.current || !cardLeadRef.current) return
      
      cardImageRef.current.style.backgroundImage = `url('${featuredArtworks[index].image}')`
      cardTitleRef.current.textContent = featuredArtworks[index].title
      cardSubtitleRef.current.textContent = featuredArtworks[index].artist || featuredArtworks[index].medium || ''
      cardLeadRef.current.textContent = featuredArtworks[index].description || ''
    }

    updateContent(activeIndex)

    const changeSlide = () => {
      if (!cardImageRef.current || !cardTextRef.current || !cardTitleRef.current || !cardSubtitleRef.current || !cardLeadRef.current) return

      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % featuredArtworks.length
        
        // Fade out
        cardImageRef.current?.classList.add('transparent')
        cardTextRef.current?.classList.add('transparent')

        setTimeout(() => {
          if (!cardImageRef.current || !cardTextRef.current || !cardTitleRef.current || !cardSubtitleRef.current || !cardLeadRef.current) return

          // Update content
          cardTitleRef.current.textContent = featuredArtworks[nextIndex].title
          cardSubtitleRef.current.textContent = featuredArtworks[nextIndex].artist || featuredArtworks[nextIndex].medium || ''
          cardLeadRef.current.textContent = featuredArtworks[nextIndex].description || ''
          
          // Fade in text
          cardTextRef.current.classList.remove('transparent')
        }, 700)

        setTimeout(() => {
          if (!cardImageRef.current) return
          // Update image
          cardImageRef.current.style.backgroundImage = `url('${featuredArtworks[nextIndex].image}')`
          cardImageRef.current.classList.remove('transparent')
        }, 250)

        return nextIndex
      })
    }

    intervalRef.current = setInterval(changeSlide, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [featuredArtworks])

  return (
    <div className="featured-section">
      <div className="featured-container">
        <h2 className="featured-title mb-4 text-black md:text-[30px] text-[20px]">Featured Works</h2>
      
        
        <div className="featured-card-wrapper">
          <div 
            ref={cardRef} 
            className="featured-card shadow featured-card-link"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
          >
            <div className="featured-card-bg"></div>
            <div 
              ref={cardImageRef} 
              className="featured-card-image"
              style={{ backgroundImage: `url('${featuredArtworks[0]?.image}')` }}
            ></div>
            <div className="featured-card-gradient"></div>
            <div ref={cardTextRef} className="featured-card-text text-center">
              <h3 ref={cardTitleRef} className="text-center mb-0">{featuredArtworks[0]?.title}</h3>
              <h5 ref={cardSubtitleRef} className="text-center">{featuredArtworks[0]?.artist || featuredArtworks[0]?.medium || ''}</h5>
              <p ref={cardLeadRef}>{featuredArtworks[0]?.description || ''}</p>
              <button 
                onClick={handleButtonClick}
                className="hero-button md:text-[20px] text-[18px] z-10"
              >
                ჩვენი კოლექცია 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Featured
