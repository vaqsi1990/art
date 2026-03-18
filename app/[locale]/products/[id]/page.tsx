"use client";

import React, { useRef, use, useState } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { getArtworkById } from '@/data/artworks'
import { useCart } from '@/hooks/useCart'
import { useLocale, useTranslations } from 'next-intl'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: PageProps) {
  const t = useTranslations('product')
  const locale = useLocale()
  const pageRef = useRef<HTMLDivElement>(null)
  const { id } = use(params)
  const artwork = getArtworkById(id)
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  useGSAP(() => {
    if (!pageRef.current) return

    // Set initial states
    gsap.set('.product-image-wrapper', {
      opacity: 0,
      scale: 0.95,
      x: -50
    })

    gsap.set('.product-info > *', {
      opacity: 0,
      y: 30
    })

    // Animate image
    gsap.to('.product-image-wrapper', {
      opacity: 1,
      scale: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    })

    // Animate info elements with stagger
    gsap.to('.product-info > *', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.4
    })

    // Animate image on load
    const img = pageRef.current.querySelector<HTMLImageElement>('.product-image-wrapper img')
    if (img) {
      if (img.complete) {
        gsap.fromTo(
          img,
          { scale: 1.1, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.3 }
        )
      } else {
        img.addEventListener('load', () => {
          gsap.fromTo(
            img,
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }
          )
        })
      }
    }
  }, { scope: pageRef })

  // Handle not found case
  if (!artwork) {
    return (
      <>
        <div className="product-details-section">
          <div className="product-details-container back-link text-white">
            <Link href={`/${locale}`} className="back-link text-white">
              {t('backToGallery')}
            </Link>
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('notFoundTitle')}</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '2rem' }}>
                {t('notFoundBody')}
              </p>
              <Link href={`/${locale}`} className="purchase-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
                {t('returnToGallery')}
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="detail-bg"></div>
      
      <div ref={pageRef} className="product-details-section">
        <div className="product-details-container">
          <Link href={`/${locale}`} className="back-link text-white">
            {t('backToGallery')}
          </Link>

          <div className="product-details-grid">
            <div className="product-image-wrapper">
              <div className="frame-outer">
                <div className="frame-inner">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>

            <div className="product-info">
              <h1 className="product-title">{artwork.title}</h1>

              {artwork.description && (
                <div className="product-description text-white">
                  <p>{artwork.description}</p>
                </div>
              )}

              <div className="product-details-list text-white ">
                {artwork.artist && (
                  <div className="detail-item">
                    <span className="detail-label">{t('artist')}</span>
                    <span className="detail-value">{artwork.artist}</span>
                  </div>
                )}
                
                {artwork.year && (
                  <div className="detail-item text-white">
                    <span className="detail-label">{t('year')}</span>
                    <span className="detail-value">{artwork.year}</span>
                  </div>
                )}
                
                {artwork.medium && (
                  <div className="detail-item text-white">
                    <span className="detail-label">{t('medium')}</span>
                    <span className="detail-value">{artwork.medium}</span>
                  </div>
                )}
                
                {artwork.dimensions && (
                  <div className="detail-item text-white">
                    <span className="detail-label">{t('dimensions')}</span>
                    <span className="detail-value">{artwork.dimensions}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  if (artwork) {
                    setIsAdding(true)
                    addToCart(artwork)
                    setTimeout(() => setIsAdding(false), 1000)
                  }
                }}
                disabled={isAdding}
                className="hero-button md:text-[20px] text-[18px] md:w-[50%] text-white"
              >
                {isAdding ? t('addedToCart') : t('addToCart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

