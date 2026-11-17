import "./AdminProducts.css";
import React, { useEffect, useState } from "react";
import api from "../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    description: "",
    price: "",
    stock: 0,
    image: "",
    categoryId: "",
    brandId: "",
    specifications: {},
  };

  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/brands"),
        ]);

      setProducts(productsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
      setBrands(brandsRes.data.data || []);
    } catch (error) {
      console.log("Ma'lumotlarni olishda xatolik:", error);
      alert("Ma'lumotlarni yuklashda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        brandId: Number(form.brandId),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        alert("Mahsulot muvaffaqiyatli yangilandi!");
      } else {
        await api.post("/products", payload);
        alert("Yangi mahsulot qo‘shildi!");
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchData();
    } catch (error) {
      console.log("Mahsulotni saqlashda xatolik:", error);
      alert(
        error.response?.data?.message ||
        "Mahsulotni saqlashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock ?? 0,
      image: product.image || "",
      categoryId: product.categoryId || "",
      brandId: product.brandId || "",
      specifications: product.specifications || {},
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Haqiqatan ham bu mahsulotni o‘chirmoqchimisiz?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      alert("Mahsulot o‘chirildi!");
      await fetchData();
    } catch (error) {
      console.log("O‘chirishda xatolik:", error);
      alert(
        error.response?.data?.message ||
        "Mahsulotni o‘chirishda xatolik yuz berdi"
      );
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div className="admin-products">
      <div className="admin-products-heading">
        <div>
          <h2>Mahsulotlar</h2>
          <p>Do‘kon mahsulotlarini boshqaring</p>
        </div>

        <span>Jami: {products.length} ta mahsulot</span>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <h3>
          {editingId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}
        </h3>

        <input
          name="name"
          placeholder="Mahsulot nomi"
          value={form.name}
          onChange={handleChange}
          minLength={2}
          maxLength={150}
          required
        />

        <textarea
          name="description"
          placeholder="Mahsulot haqida ma'lumot"
          value={form.description}
          onChange={handleChange}
        />

        <div className="admin-product-form-row">
          <input
            name="price"
            type="number"
            placeholder="Narxi"
            value={form.price}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Ombordagi soni"
            value={form.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <input
          name="image"
          placeholder="Rasm URL manzili"
          value={form.image}
          onChange={handleChange}
        />

        <div className="admin-product-form-row">
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Kategoriyani tanlang</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            name="brandId"
            value={form.brandId}
            onChange={handleChange}
            required
          >
            <option value="">Brendni tanlang</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-product-form-actions">
          <button type="submit" disabled={loading}>
            {loading
              ? "Saqlanmoqda..."
              : editingId
              ? "O‘zgarishlarni saqlash"
              : "Mahsulot qo‘shish"}
          </button>

          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <div className="admin-products-table">
        <h3>Barcha mahsulotlar</h3>

        <div className="admin-products-list">
          {products.map((product) => (
            <div className="admin-product-item" key={product.id}>
              <div className="admin-product-info">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="admin-product-placeholder">📦</div>
                )}

                <div>
                  <strong>{product.name}</strong>
                  <p>{Number(product.price).toLocaleString("uz-UZ")} $</p>
                  <span>Omborda: {product.stock} ta</span>
                </div>
              </div>

              <div className="admin-product-actions">
                <button onClick={() => handleEdit(product)}>
                  Tahrirlash
                </button>

                <button onClick={() => handleDelete(product.id)}>
                  O‘chirish
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p>Hozircha mahsulotlar mavjud emas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;