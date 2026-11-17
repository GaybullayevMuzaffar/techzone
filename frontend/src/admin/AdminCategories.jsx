import React, { useEffect, useState } from "react";
import api from "../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    description: "",
    image: "",
  };

  const [form, setForm] = useState(initialForm);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      console.log("Kategoriyalarni olishda xatolik:", error);
      alert("Kategoriyalarni yuklashda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchCategories();
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

      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        alert("Kategoriya yangilandi!");
      } else {
        await api.post("/categories", form);
        alert("Yangi kategoriya qo‘shildi!");
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchCategories();
    } catch (error) {
      console.log("Saqlashda xatolik:", error);
      alert(
        error.response?.data?.message ||
        "Kategoriyani saqlashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Haqiqatan ham bu kategoriyani o‘chirmoqchimisiz?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/categories/${id}`);
      alert("Kategoriya o‘chirildi!");
      await fetchCategories();
    } catch (error) {
      console.log("O‘chirishda xatolik:", error);
      alert(
        error.response?.data?.message ||
        "Kategoriyani o‘chirishda xatolik yuz berdi"
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
          <h2>Kategoriyalar</h2>
          <p>Mahsulot kategoriyalarini boshqaring</p>
        </div>

        <span>Jami: {categories.length} ta kategoriya</span>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <h3>
          {editingId ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo‘shish"}
        </h3>

        <input
          name="name"
          placeholder="Kategoriya nomi"
          value={form.name}
          onChange={handleChange}
          required
          minLength={2}
        />

        <textarea
          name="description"
          placeholder="Kategoriya haqida ma'lumot"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Rasm URL manzili"
          value={form.image}
          onChange={handleChange}
        />

        <div className="admin-product-form-actions">
          <button type="submit" disabled={loading}>
            {loading
              ? "Saqlanmoqda..."
              : editingId
              ? "O‘zgarishlarni saqlash"
              : "Kategoriya qo‘shish"}
          </button>

          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <div className="admin-products-table">
        <h3>Barcha kategoriyalar</h3>

        <div className="admin-products-list">
          {categories.map((category) => (
            <div className="admin-product-item" key={category.id}>
              <div className="admin-product-info">
                {category.image ? (
                  <img src={category.image} alt={category.name} />
                ) : (
                  <div className="admin-product-placeholder">📁</div>
                )}

                <div>
                  <strong>{category.name}</strong>
                  <p>{category.description || "Tavsif mavjud emas"}</p>
                </div>
              </div>

              <div className="admin-product-actions">
                <button onClick={() => handleEdit(category)}>
                  Tahrirlash
                </button>

                <button onClick={() => handleDelete(category.id)}>
                  O‘chirish
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p>Hozircha kategoriyalar mavjud emas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;