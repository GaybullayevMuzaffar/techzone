import React from "react";

function ProductsPage({
  filteredProducts,
  categories,
  activeCategory,
  setActiveCategory,
  loading,
  error,
  defaultImage,
  addToCart,
  getCategoryName,
  formatPrice,
  setSearch,
}) {
  return (
    <section className="products-section">
      <div className="section-heading products-heading">
        <div>
          <span className="section-label">SIZ UCHUN TANLADIK</span>
          <h2>Mashhur mahsulotlar</h2>
        </div>

        <div className="product-tabs">
          {["Barchasi", ...categories.map((category) => category.name)].map(
            (category) => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? "tab active-tab"
                    : "tab"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            )
          )}
        </div>
      </div>

      {loading ? (
        <div className="empty-products">
          <span>⏳</span>
          <h3>Mahsulotlar yuklanmoqda...</h3>
          <p>Iltimos, biroz kuting.</p>
        </div>
      ) : error ? (
        <div className="empty-products">
          <span>⚠️</span>
          <h3>{error}</h3>
          <button
            className="secondary-button"
            onClick={() => window.location.reload()}
          >
            Qayta urinish
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                {product.stock <= 5 && (
                  <span className="product-badge">Kam qoldi</span>
                )}

                <button
                  className="favorite-button"
                  title="Sevimlilarga qo‘shish"
                  onClick={() =>
                    alert("Sevimlilar funksiyasi keyin qo‘shiladi.")
                  }
                >
                  ♡
                </button>

                <img
                  src={product.image || defaultImage}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = defaultImage;
                  }}
                />

                <button
                  className="quick-add"
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0
                    ? "Sotuvda yo‘q"
                    : "+ Savatga qo‘shish"}
                </button>
              </div>

              <div className="product-info">
                <span className="product-category">
                  {getCategoryName(product)}
                </span>

                <h3>{product.name}</h3>

                <div className="product-rating">
                  <span>★ ★ ★ ★ ★</span>
                  <small>Yangi</small>
                </div>

                <div className="product-price-row">
                  <div>
                    <strong>{formatPrice(product.price)}</strong>
                  </div>

                  <button
                    className="add-button"
                    onClick={() => addToCart(product)}
                    title="Savatga qo‘shish"
                    disabled={product.stock <= 0}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-products">
          <span>🔎</span>
          <h3>Mahsulot topilmadi</h3>
          <p>Boshqa nom yoki kategoriyani sinab ko‘ring.</p>

          <button
            className="secondary-button"
            onClick={() => {
              setSearch("");
              setActiveCategory("Barchasi");
            }}
          >
            Filtrni tozalash
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductsPage;