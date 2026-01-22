"use client";

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { artworks } from '@/data/artworks'

const ITEMS_PER_PAGE = 9

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(artworks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentArtworks = artworks.slice(startIndex, endIndex)

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
        </div>
      </div>
    </>
  )
}
