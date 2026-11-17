import React from "react";

function BrandsPage({ brands }) {
  return (
    <div className="catalog-page">
      <div className="catalog-hero">
        <span className="section-label">OUR PARTNERS</span>

        <h1>
          Dunyoning mashhur <span>brendlari.</span>
        </h1>

        <p>
          Siz ishonadigan va sifatini qadrlaydigan texnologiya
          brendlari — barchasi TECHZONE’da.
        </p>

        <div className="catalog-count">
          <strong>{brands.length}</strong>
          <span>ta mashhur brend</span>
        </div>
      </div>

      <section className="brands-section catalog-content">
        <div className="section-heading">
          <div>
            <span className="section-label">TECHZONE PARTNERS</span>
            <h2>Bizning brendlar</h2>
          </div>
        </div>

        <div className="brands-grid">
          {brands.map((brand, index) => (
            <div className="brand-card" key={brand.id}>
              <span className="category-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} />
              ) : (
                <span className="brand-name">{brand.name}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default BrandsPage;