import React from "react";

function CategoriesPage({
  categories,
  categoryIcons,
  setActiveCategory,
  navigate,
}) {
  return (
    <div className="catalog-page">
      <div className="catalog-hero">
        <span className="section-label">TECHZONE COLLECTION</span>
        <h1>
          O'zingizga mos <span>texnologiyani</span> toping.
        </h1>
        <p>
          Turli kategoriyalardagi eng yaxshi texnologik mahsulotlarni
          bir joyda kashf eting.
        </p>
        <div className="catalog-count">
          <strong>{categories.length}</strong>
          <span>ta kategoriya mavjud</span>
        </div>
      </div>

      <section className="categories-section catalog-content">
        <div className="section-heading">
          <div>
            <span className="section-label">EXPLORE COLLECTIONS</span>
            <h2>Barcha kategoriyalar</h2>
          </div>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <button
              className="category-card"
              key={category.id}
              onClick={() => {
                setActiveCategory(category.name);
                navigate("/products");
              }}
            >
              <span className="category-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="category-icon">
                {categoryIcons[category.name] || "📦"}
              </div>

              <h3>{category.name}</h3>
              <span className="category-explore">
                Mahsulotlarni ko'rish →
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CategoriesPage;