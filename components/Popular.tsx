import React from 'react'
import { artworks } from '@/data/artworks'
import Link from 'next/link'
const Popular = () => {


  return (
    <div className="popular-section">
      <div className="popular-container">
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

              <div className="art-info">
                <h3>{artwork.title}</h3>
                <p>{artwork.price} ₾</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Popular