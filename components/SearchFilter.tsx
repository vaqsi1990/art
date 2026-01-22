"use client";

import React, { useState } from 'react'
import { Artwork } from '@/data/artworks'

interface SearchFilterProps {
  artworks: Artwork[]
  onFilterChange: (filtered: Artwork[]) => void
  initialMedium?: string
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'year-desc'

export default function SearchFilter({ artworks, onFilterChange, initialMedium }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedium, setSelectedMedium] = useState<string>(initialMedium || 'all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Update selectedMedium when initialMedium changes (from URL)
  React.useEffect(() => {
    if (initialMedium) {
      setSelectedMedium(initialMedium)
    }
  }, [initialMedium])

  // Get unique mediums
  const mediums = ['all', 'featured', ...Array.from(new Set(artworks.map(a => a.medium).filter(Boolean)))]

  // Get price range from artworks
  const maxPrice = Math.max(...artworks.map(a => a.price), 0)
  const minPrice = Math.min(...artworks.map(a => a.price), 0)

  React.useEffect(() => {
    let filtered = [...artworks]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(query) ||
        artwork.artist?.toLowerCase().includes(query) ||
        artwork.description?.toLowerCase().includes(query)
      )
    }

    // Medium filter
    if (selectedMedium !== 'all' && selectedMedium !== 'featured') {
      filtered = filtered.filter(artwork => artwork.medium === selectedMedium)
    }

    // Featured filter (price > 1000)
    if (selectedMedium === 'featured') {
      filtered = filtered.filter(artwork => artwork.price > 1000)
    }

    // Price range filter
    filtered = filtered.filter(artwork =>
      artwork.price >= priceRange[0] && artwork.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'title-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'year-desc':
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0))
        break
      default:
        break
    }

    onFilterChange(filtered)
  }, [searchQuery, selectedMedium, priceRange, sortBy, artworks, onFilterChange])

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...priceRange]
    newRange[index] = value
    if (index === 0 && value > priceRange[1]) {
      newRange[1] = value
    }
    if (index === 1 && value < priceRange[0]) {
      newRange[0] = value
    }
    setPriceRange(newRange)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedMedium('all')
    setPriceRange([minPrice, maxPrice])
    setSortBy('default')
  }

  return (
    <div className="search-filter-container">
      <div className="search-filter-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input text-white"
          />
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>

        <div className="filter-controls">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="filter-toggle text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sort-select text-white"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
            <option value="year-desc">Year: Newest First</option>
          </select>
        </div>
      </div>

      {isFilterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label className="filter-label text-white">Medium</label>
            <select
              value={selectedMedium}
              onChange={(e) => setSelectedMedium(e.target.value)}
              className="filter-select text-white"
            >
              {mediums.map(medium => (
                <option key={medium} value={medium}>
                  {medium === 'all' ? 'All Mediums' : medium === 'featured' ? 'Featured Works' : medium}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label text-white">
              Price Range: {priceRange[0]}₾ - {priceRange[1]}₾
            </label>
            <div className="price-range-inputs">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
                className="price-slider"
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
                className="price-slider"
              />
            </div>
            <div className="price-values text-white">
              <span>{priceRange[0]}₾</span>
              <span>{priceRange[1]}₾</span>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="reset-filters text-white"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
