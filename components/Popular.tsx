import React from 'react'
import { artworks } from '@/data/artworks'
import Link from 'next/link'
const Popular = () => {


  return (
    <div className="popular-section">
      <div className="popular-container p-4">
      <h2 className="categories-title md:text-[30px] text-[20px]">Popular Collections</h2>
        <div className="popular-grid">
          {artworks.map((artwork, index) => (
            <div key={index} className="popular-item">
              <div className="frame-outer">
                <div className="frame-inner">
                  <Link href={`/products/${artwork.id}`}>
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      loading="eager"
                    />
                  </Link>
                </div>
              </div>

              <div className="art-info text-black">
                <h3 className="text-black">{artwork.title}</h3>
                <p className="text-black">{artwork.price} ₾</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Popular