"use client";

import React, { useState } from 'react'
import { Artwork } from '@/data/artworks'

interface SearchFilterProps {
  artworks: Artwork[]
  onFilterChange: (filtered: Artwork[]) => void
  initialMedium?: string
}

type SortOption = 'default' | 'title-asc' | 'title-desc' | 'year-desc'

export default function SearchFilter({ artworks, onFilterChange, initialMedium }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedium, setSelectedMedium] = useState<string>(initialMedium || 'all')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Update selectedMedium when initialMedium changes (from URL)
  React.useEffect(() => {
    if (initialMedium) {
      setSelectedMedium(initialMedium)
    }
  }, [initialMedium])

  // Get unique mediums
  const mediums = ['all', ...Array.from(new Set(artworks.map(a => a.medium).filter(Boolean)))]

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
    if (selectedMedium !== 'all') {
      filtered = filtered.filter(artwork => artwork.medium === selectedMedium)
    }

    // Sort
    switch (sortBy) {
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
  }, [searchQuery, selectedMedium, sortBy, artworks, onFilterChange])

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedMedium('all')
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
                  {medium === 'all' ? 'All Mediums' : medium}
                </option>
              ))}
            </select>
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
