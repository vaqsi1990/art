"use client";

import React from 'react'
import { artworks } from '@/data/artworks'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
const Popular = () => {
  const t = useTranslations('popular')
  const locale = useLocale()

  return (
    <div className="popular-section">
      <div className="popular-container p-4">
      <h2 className="categories-title md:text-[30px] text-[20px]">{t('title')}</h2>
        <div className="popular-grid">
          {artworks.map((artwork, index) => (
            <div key={index} className="popular-item">
              <div className="frame-outer">
                <div className="frame-inner">
                  <Link href={`/${locale}/products/${artwork.id}`}>
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      loading="eager"
                    />
                  </Link>
                </div>
              </div>

              <div className="art-info text-black">
                <h3 className="text-black text-[18px]">{artwork.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Popular