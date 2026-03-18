"use client";

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { artworks } from '@/data/artworks'
import SearchFilter from '@/components/SearchFilter'
import { useLocale, useTranslations } from 'next-intl'

const ITEMS_PER_PAGE = 9

function ShopContent() {
  const t = useTranslations('shop')
  const searchParams = useSearchParams()
  const locale = useLocale()
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
          <h1 className="shop-title text-white">{t('title')}</h1>
          
          <SearchFilter 
            artworks={artworks} 
            onFilterChange={setFilteredArtworks}
            initialMedium={initialMedium}
          />

          {filteredArtworks.length === 0 ? (
            <div className="no-results text-white">
              <p>{t('noResults')}</p>
            </div>
          ) : (
            <>
              <div className="shop-grid">
                {currentArtworks.map((artwork) => (
                  <div key={artwork.id} className="shop-item">
                    <Link href={`/${locale}/products/${artwork.id}`} className="shop-item-link">
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
                    aria-label={t('ariaPrevPage')}
                  >
                    {t('paginationPrev')}
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-number text-white ${currentPage === page ? 'active' : ''}`}
                        aria-label={t('ariaGoToPage', {page})}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button text-white"
                    aria-label={t('ariaNextPage')}
                  >
                    {t('paginationNext')}
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
  const t = useTranslations('shop')

  return (
    <Suspense fallback={
      <div className="shop-section">
        <div className="shop-container">
          <h1 className="shop-title text-white">{t('title')}</h1>
          <div className="text-white">{t('loading')}</div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}

