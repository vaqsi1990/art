"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { artworks } from '@/data/artworks'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef } from 'react'

const Categories = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get unique mediums/categories from artworks
  const categories = Array.from(new Set(artworks.map(a => a.medium).filter((m): m is string => typeof m === 'string' && m.length > 0)))
  
  // Category buttons data - for filtering
  const categoryButtons = [
    { name: 'All Collections', value: 'all' },
    { name: 'Featured', value: 'featured' },
    ...categories.map(cat => ({
      name: cat,
      value: cat
    }))
  ]
  
  // All available categories for display
  const allCategories = [
    ...categories,
   
 
  ]

  // Filter categories based on selected button
  const getFilteredCategories = () => {
    if (selectedCategory === 'all') {
      return allCategories
    } else if (selectedCategory === 'featured') {
      return ['Featured Works']
    } else {
      // Filter to show only the selected medium category
      return allCategories.filter(cat => {
        if (cat === 'All Collections' || cat === 'Featured Works') return false
        return cat === selectedCategory
      })
    }
  }

  const filteredCategories = getFilteredCategories()

  // Get artworks for the selected category
  const getFilteredArtworks = () => {
    if (selectedCategory === 'all') {
      return artworks
    } else if (selectedCategory === 'featured') {
      return artworks.filter(a => a.price > 1000)
    } else {
      return artworks.filter(a => a.medium === selectedCategory)
    }
  }

  const filteredArtworks = getFilteredArtworks()

  // Get artwork count per category
  const getCategoryCount = (category: string): number => {
    if (category === 'All Collections') return artworks.length
    if (category === 'Featured Works') return artworks.filter(a => a.price > 1000).length
    return artworks.filter(a => a.medium === category).length
  }

  // Get a sample image for each category
  const getCategoryImage = (category: string): string => {
    if (category === 'All Collections') return artworks[0]?.image || '/img_01.jpg'
    if (category === 'Featured Works') {
      const featured = artworks.find(a => a.price > 1000)
      return featured?.image || artworks[0]?.image || '/img_01.jpg'
    }
    const categoryArtwork = artworks.find(a => a.medium === category)
    return categoryArtwork?.image || artworks[0]?.image || '/img_01.jpg'
  }

  useGSAP(() => {
    if (!sectionRef.current) return

    // Set initial state
    gsap.set('.popular-item', {
      opacity: 0,
      y: 50,
      scale: 0.95
    })

    // Animate items with stagger
    gsap.to('.popular-item', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.2
    })
  }, { scope: sectionRef })

  const handleCategoryClick = (category: string) => {
    // Navigate to shop with category filter
    // This will be handled by the Link component
  }

  return (
    <div ref={sectionRef} className="categories-section">
      <div className="categories-container">
        <h2 className="categories-title text-black md:text-[30px] text-[20px]">Browse by Collection</h2>
        
        
        {/* Category Buttons */}
        <div className="category-buttons">
          {categoryButtons.map((button) => {
            const isActive = selectedCategory === button.value
            
            return (
              <button
                key={button.value}
                onClick={() => setSelectedCategory(button.value)}
                className={`category-button text-black; ${isActive ? 'active' : ''}`}
              >
                {button.name}
              </button>
            )
          })}
        </div>
        
        <div className="popular-grid filtered">
          {filteredArtworks.map((artwork, index) => {
            return (
              <div key={artwork.id} className="popular-item">
                <div className="frame-outer">
                  <div className="frame-inner">
                    <Link href={`/products/${artwork.id}`}>
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </Link>
                  </div>
                </div>
                <div className="art-info text-black">
                  <h3 className="text-black">{artwork.title}</h3>
                  <p className="text-black">{artwork.price} ₾</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Categories
