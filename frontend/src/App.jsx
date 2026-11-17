import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import "./App.css";

import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import BrandsPage from "./pages/BrandsPage";

import Reviews from "./components/Reviews";
import Orders from "./components/Order";
import Checkout from "./components/Checkout";
import Cart from "./components/Cart";
import api from "./services/api";
import Auth from "./components/Auth";
import AdminDashboard from "./admin/AdminDashboard";

const categoryIcons = {
  Noutbuklar: "💻",
  Smartfonlar: "📱",
  Quloqchinlar: "🎧",
  "Aqlli soatlar": "⌚",
  Aksessuarlar: "🎮",
  Gaming: "🕹️",
};

const defaultImage =
  "https://placehold.co/400x300/191927/ffffff?text=TECHZONE";

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(Number(price) || 0) + " $";
}

function App() {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
  };

  // Backenddan mahsulot va kategoriyalarni olish

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/brands"),
        ]);

        const productsData = productsResponse.data.data;
        const categoriesData = categoriesResponse.data.data;
        const brandsData = brandsResponse.data.data;

        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setBrands(Array.isArray(brandsData) ? brandsData : []);

      } catch (error) {
        console.error("Ma'lumot olishda xatolik:", error);
        setError(
          "Ma'lumotlarni olishda xatolik. Backend ishlayotganini tekshiring."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, []);

  // Login qilingan foydalanuvchining savatini backenddan olish
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        const cartItems = response.data.data || [];

        const formattedCart = cartItems
          .filter((item) => item.product)
          .map((item) => ({
            ...item.product,
            quantity: item.quantity,
            cartId: item.id,
          }));

        setCart(formattedCart);
      } catch (error) {
        console.error("Savatni yuklashda xatolik:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchCart();
  }, [user]);

  // Savatga mahsulot qo'shish

  const addToCart = async (product) => {
  try {
    await api.post("/cart", {
      productId: product.id,
      quantity: 1,
    });

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
    alert("Mahsulot savatga qo'shildi!");

  } catch (error) {
    if (error.response?.status === 401) {
      alert("Savatdan foydalanish uchun avval tizimga kiring!");
    } else {
      alert(
        error.response?.data?.message ||
        "Savatga qo'shishda xatolik yuz berdi!"
      );
    }
  }
};

const changeCartQuantity = async (item, newQuantity) => {
  if (newQuantity < 1) return;

  try {
    await api.put(`/cart/${item.cartId}`, {
      quantity: newQuantity,
    });

    setCart((currentCart) =>
      currentCart.map((product) =>
        product.cartId === item.cartId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Mahsulot miqdorini o'zgartirib bo'lmadi!"
    );
  }
};

const removeFromCart = async (cartId) => {
  try {
    await api.delete(`/cart/${cartId}`);

    setCart((currentCart) =>
      currentCart.filter((item) => item.cartId !== cartId)
    );
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Mahsulotni savatdan o'chirib bo'lmadi!"
    );
  }
};

const handleCreateOrder = async ({ address, phone }) => {
  try {
    setIsOrdering(true);

    const response = await api.post("/orders", {
      address,
      phone,
    });

    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    alert(
      response.data.message ||
        "Buyurtmangiz muvaffaqiyatli yaratildi!"
    );
  } catch (error) {
    console.error("Buyurtma yaratishda xatolik:", error);

    alert(
      error.response?.data?.message ||
        "Buyurtma yaratishda xatolik yuz berdi!"
    );
  } finally {
    setIsOrdering(false);
  }
};

  // Kategoriya nomini aniqlash

  const getCategoryName = (product) => {

    if (product.category?.name) {

      return product.category.name;

    }

    const category = categories.find(

      (item) => Number(item.id) === Number(product.categoryId)

    );

    return category?.name || "Boshqa";

  };

  // Mahsulotlarni qidirish va filtrlash

  const filteredProducts = products.filter((product) => {

    const categoryName = getCategoryName(product);

    const matchesCategory =

      activeCategory === "Barchasi" || categoryName === activeCategory;

    const matchesSearch = product.name

      ?.toLowerCase()

      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;

  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {/* NAVBAR */}

      <header className="navbar">
        <NavLink
          className="logo"
          to="/"
        >
          <span className="logo-mark">T</span>
          TECHZONE<span className="logo-dot">.</span>
        </NavLink>

        <nav className="nav-links">
          {[
            "Bosh sahifa",
            "Mahsulotlar",
            "Kategoriyalar",
            "Brendlar",
            "Aloqa",
            "Buyurtmalarim",
            "Sharhlarim",
             ...(user?.role === "admin" ? ["Admin Panel"] : []),
          ].map((item) => (
            <NavLink
  key={item}
  to={
  item === "Mahsulotlar"
    ? "/products"
    : item === "Kategoriyalar"
      ? "/categories"
      : item === "Brendlar"
        ? "/brands"
        : item === "Aloqa"
          ? "/#contact"
          : item === "Buyurtmalarim"
            ? "/orders"
            : item === "Sharhlarim"
              ? "/reviews"
              : item === "Admin Panel"
                ? "/admin"
                : "/"
}
  className={({ isActive }) =>
    isActive ? "active" : ""
  }
  onClick={() => {
    if (item === "Mahsulotlar") {
      setActiveCategory("Barchasi");
      setSearch("");
    }
  }}
>
  {item}
</NavLink>

          ))}

        </nav>


        <div className="nav-actions">

          <label className="search-box">

            <span>⌕</span>

            <input

              type="text"

              placeholder="Qidirish..."

              value={search}

              onChange={(e) => {

                setSearch(e.target.value);

                document.getElementById("products")?.scrollIntoView({

                  behavior: "smooth",

                });

              }}

            />

          </label>

          <button
            className="icon-button"
            title="Tizimdan chiqish"
            onClick={handleLogout}>
            ↪
          </button>

          <button
            className="cart-button"
            title="Savat"
            onClick={() => setIsCartOpen(true)}>
            🛒
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>

      </header>

      

      <main id="home">
  <Routes>
    <Route
      path="/"
      element={
        <>

        {/* HERO */}

        <section className="hero">

          <div className="hero-content">

            <span className="eyebrow">

              <span className="eyebrow-dot"></span>

              TEXNOLOGIYANING YANGI DAVRI

            </span>

            <h1>

              Kelajak

              <br />

              texnologiyasi

              <br />

              <span>shu yerdan boshlanadi.</span>

            </h1>

            <p>

              Eng so‘nggi smartfonlar, noutbuklar va gadjetlar. Sifat, ishonch

              va qulaylik — barchasi TECHZONE’da.

            </p>

            <div className="hero-actions">

              <a href="#products" className="primary-button">

                Xarid qilish <span>→</span>

              </a>

              <a href="#categories" className="secondary-button">

                Kategoriyalar

              </a>

            </div>

            <div className="hero-stats">

              <div>

                <strong>500+</strong>

                <span>Mahsulotlar</span>

              </div>

              <div>

                <strong>10K+</strong>

                <span>Mamnun mijozlar</span>

              </div>

              <div>

                <strong>24/7</strong>

                <span>Qo‘llab-quvvatlash</span>

              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="hero-glow"></div>

            <div className="hero-circle circle-one"></div>

            <div className="hero-circle circle-two"></div>

            <img

              src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1000"

              alt="Premium smartfon"

              className="hero-phone"

            />

            <div className="floating-card">

              <span className="floating-icon">✦</span>

              <div>

                <strong>Premium sifat</strong>

                <small>Eng yaxshi tanlov</small>

              </div>

            </div>

            <div className="hero-product-label">

              <span>YANGI AVLOD</span>

              <strong>iPhone Series</strong>

            </div>

          </div>

        </section>

        {/* AFZALLIKLAR */}

        <section className="benefits">

          <div className="benefit-item">

            <span className="benefit-icon">⚡</span>

            <div>

              <strong>Tez yetkazib berish</strong>

              <small>1–3 ish kuni</small>

            </div>

          </div>

          <div className="benefit-item">

            <span className="benefit-icon">🛡️</span>

            <div>

              <strong>Xavfsiz to‘lov</strong>

              <small>100% himoya</small>

            </div>

          </div>

          <div className="benefit-item">

            <span className="benefit-icon">🎧</span>

            <div>

              <strong>24/7 qo‘llab-quvvatlash</strong>

              <small>Doim siz bilan</small>

            </div>

          </div>

          <div className="benefit-item">

            <span className="benefit-icon">↻</span>

            <div>

              <strong>Oson qaytarish</strong>

              <small>14 kun ichida</small>

            </div>

          </div>

        </section>

        {/* KATEGORIYALAR */}

        <section className="categories-section" id="categories">

          <div className="section-heading">

            <div>

              <span className="section-label">BIZNING TANLOV</span>

              <h2>Kategoriyalar</h2>

            </div>

            <a

              href="#products"

              className="text-link"

              onClick={() => setActiveCategory("Barchasi")}

            >

              Barchasini ko‘rish →

            </a>

          </div>

          <div className="category-grid">

            {categories.map((category) => (

              <button

                className={`category-card ${

                  activeCategory === category.name ? "selected" : ""

                }`}

                key={category.id}

                onClick={() => {

                  setActiveCategory(category.name);

                  document.getElementById("products")?.scrollIntoView({

                    behavior: "smooth",

                  });

                }}

              >

                <span className="category-icon">

                  {categoryIcons[category.name] || "📦"}

                </span>

                <strong>{category.name}</strong>

                <span className="category-arrow">↗</span>

              </button>

            ))}

          </div>

        </section>

        {/* BRENDLAR */}
        <section className="brands-section" id="brands">
          <div className="section-heading">
            <div>
              <span className="section-label">BIZNING HAMKORLAR</span>
              <h2>Mashhur brendlar</h2>
            </div>
          </div>

          <div className="brands-grid">
            {brands.map((brand) => (
              <div className="brand-card" key={brand.id}>
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} />
                ) : (
                  <span className="brand-name">{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* MAHSULOTLAR */}

        <section className="products-section" id="products">
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
                      activeCategory === category ? "tab active-tab" : "tab"
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
                      onClick={() => alert("Sevimlilar funksiyasi keyin qo‘shiladi.")}
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
                      {product.stock <= 0 ? "Sotuvda yo‘q" : "+ Savatga qo‘shish"}
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
                        <strong>
                          {formatPrice(product.price)}
                        </strong>
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

        {/* GAMING BANNER */}

        <section className="promo-banner">

          <div className="promo-content">

            <span className="section-label">GAMING ZONASI</span>

            <h2>

              O‘yinning yangi

              <br />

              darajasiga chiqing.

            </h2>

            <p>

              Sevimli o‘yinlaringiz uchun kuchli qurilmalar sizni kutmoqda.

            </p>

            <a

              href="#products"

              className="primary-button"

              onClick={() => setActiveCategory("Barchasi")}

            >

              Ko‘rib chiqish <span>→</span>

            </a>

          </div>

          <div className="promo-art">

            <div className="promo-glow"></div>

            <img

              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=900"

              alt="Gaming qurilmasi"

            />

          </div>

        </section>

        {/* NEWSLETTER */}

        <section className="newsletter">

          <div>

            <span className="section-label">YANGILIKLAR</span>

            <h2>Yangiliklardan xabardor bo‘ling.</h2>

            <p>

              Yangi mahsulotlar va maxsus takliflarni birinchilardan biling.

            </p>

          </div>

          <form

            className="newsletter-form"

            onSubmit={(e) => {

              e.preventDefault();

              alert("Rahmat! Siz yangiliklarga obuna bo‘ldingiz.");

              e.target.reset();

            }}

          >

            <input

              type="email"

              placeholder="Email manzilingiz"

              required

            />

            <button type="submit">Obuna bo‘lish →</button>
          </form>
        </section>
                </>
      }
    />

    <Route
      path="/products"
      element={
        <ProductsPage
          filteredProducts={filteredProducts}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          loading={loading}
          error={error}
          defaultImage={defaultImage}
          addToCart={addToCart}
          getCategoryName={getCategoryName}
          formatPrice={formatPrice}
          setSearch={setSearch}
        />
      }
    />

    <Route
      path="/categories"
      element={
        <CategoriesPage
          categories={categories}
          categoryIcons={categoryIcons}
          setActiveCategory={setActiveCategory}
          navigate={navigate}
        />
      }
    />

    <Route
      path="/brands"
      element={<BrandsPage brands={brands} />}
    />

    <Route
      path="/orders"
      element={<Orders />}
    />

    <Route
      path="/reviews"
      element={<Reviews />}
    />

    <Route
      path="/admin"
      element={<AdminDashboard />}
    />
  </Routes>
</main>

      {/* FOOTER */}

      <footer className="footer" id="contact">

        <div className="footer-main">

          <div className="footer-brand">

            <a className="logo" href="#home">

              <span className="logo-mark">T</span>

              TECHZONE<span className="logo-dot">.</span>

            </a>

            <p>

              Zamonaviy texnologiyalar olamiga xush kelibsiz. Sifatli

              mahsulotlar va ishonchli xizmat.

            </p>

            <div className="social-links">

              <a href="#contact">Telegram</a>

              <a href="#contact">Instagram</a>

            </div>

          </div>

          <div className="footer-column">

            <h4>Foydali havolalar</h4>

            <a href="#home">Bosh sahifa</a>

            <a href="#products">Mahsulotlar</a>

            <a href="#categories">Kategoriyalar</a>

            <a href="#contact">Biz haqimizda</a>

          </div>

          <div className="footer-column">

            <h4>Yordam</h4>

            <a href="#contact">Yetkazib berish</a>

            <a href="#contact">To‘lov usullari</a>

            <a href="#contact">Qaytarish siyosati</a>

            <a href="#contact">Savol-javoblar</a>

          </div>

          <div className="footer-column">

            <h4>Biz bilan bog‘laning</h4>

            <span>+998 90 123 45 67</span>

            <span>info@techzone.uz</span>

            <span>Toshkent, O‘zbekiston</span>

          </div>

        </div>

        <div className="footer-bottom">

          <span>© 2026 TECHZONE. Barcha huquqlar himoyalangan.</span>

          <span>Visa · Mastercard · Payme</span>

        </div>

      </footer>
      
      <Cart
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onChangeQuantity={changeCartQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      <Checkout
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCreateOrder}
        loading={isOrdering}
        totalPrice={cart.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0
        )}
      />
    </div>
  );

}

export default App;