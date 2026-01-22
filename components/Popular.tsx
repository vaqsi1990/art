import React from 'react'

const Popular = () => {
  const artworks = [
    {
      image: "/img_01.jpg",
      title: "Color of Folks",
      price: 850
    },
    {
      image: "/img_02.jpg",
      title: "Abstract Dreams",
      price: 1200
    },
    {
      image: "/img_03.jpg",
      title: "Urban Symphony",
      price: 950
    },
    {
      image: "/img_04.jpg",
      title: "Nature's Whisper",
      price: 1100
    }
  ];

  return (
    <div className="popular-section">
      <div className="popular-container">
        <div className="popular-grid">
          {artworks.map((artwork, index) => (
            <div key={index} className="popular-item">
              <div className="frame-outer">
                <div className="frame-inner">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    loading="eager"
                  />
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