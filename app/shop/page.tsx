"use client";

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { artworks } from '@/data/artworks'
import SearchFilter from '@/components/SearchFilter'

const ITEMS_PER_PAGE = 9

function ShopContent() {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredArtworks, setFilteredArtworks] = useState(artworks)
  const initialMedium = searchParams.get('medium') || undefined

  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentArtworks = filteredArtworks.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [filteredArtworks.length])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="detail-bg"></div>
      
      <div className="shop-section">
        <div className="shop-container">
          <h1 className="shop-title text-white">Shop</h1>
          
          <SearchFilter 
            artworks={artworks} 
            onFilterChange={setFilteredArtworks}
            initialMedium={initialMedium}
          />

          {filteredArtworks.length === 0 ? (
            <div className="no-results text-white">
              <p>No artworks found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="results-count text-white">
                Showing {currentArtworks.length} of {filteredArtworks.length} artworks
              </div>
              
              <div className="shop-grid">
                {currentArtworks.map((artwork) => (
                  <div key={artwork.id} className="shop-item">
                    <Link href={`/products/${artwork.id}`} className="shop-item-link">
                      <div className="frame-outer">
                        <div className="frame-inner">
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>

                      <div className="art-info text-white">
                        <h3 className="text-white">{artwork.title}</h3>
                        <p className="text-white">{artwork.price} ₾</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination text-white">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button text-white"
                    aria-label="Previous page"
                  >
                    ← Previous
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-number text-white ${currentPage === page ? 'active' : ''}`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button text-white"
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="shop-section">
        <div className="shop-container">
          <h1 className="shop-title text-white">Shop</h1>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
