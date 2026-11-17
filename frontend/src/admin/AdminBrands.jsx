
import React, { useEffect, useState } from "react";
import api from "../services/api";

function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    description: "",
    logo: "",
  };

  const [form, setForm] = useState(initialForm);

  const fetchBrands = async () => {
    try {
      const response = await api.get("/brands");
      setBrands(response.data.data || []);
    } catch (error) {
      console.log("Brendlarni olishda xatolik:", error);
      alert("Brendlarni yuklashda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchBrands();
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
        await api.put(`/brands/${editingId}`, form);
        alert("Brend yangilandi!");
      } else {
        await api.post("/brands", form);
        alert("Yangi brend qo‘shildi!");
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchBrands();
    } catch (error) {
      console.log("Brendni saqlashda xatolik:", error);
      alert(
        error.response?.data?.message ||
        "Brendni saqlashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand.id);

    setForm({
      name: brand.name || "",
      description: brand.description || "",
      logo: brand.logo || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Haqiqatan ham bu brendni o‘chirmoqchimisiz?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/brands/${id}`);
      alert("Brend o‘chirildi!");
      await fetchBrands();
    } catch (error) {
      console.log("Brendni o‘chirishda xatolik:", error);
      alert(
        error.response?.data?.message ||
        "Brendni o‘chirishda xatolik yuz berdi"
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
          <h2>Brendlar</h2>
          <p>Do‘kon brendlarini boshqaring</p>
        </div>

        <span>Jami: {brands.length} ta brend</span>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <h3>
          {editingId ? "Brendni tahrirlash" : "Yangi brend qo‘shish"}
        </h3>

        <input
          name="name"
          placeholder="Brend nomi"
          value={form.name}
          onChange={handleChange}
          minLength={2}
          required
        />

        <textarea
          name="description"
          placeholder="Brend haqida ma'lumot"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="logo"
          placeholder="Logo URL manzili"
          value={form.logo}
          onChange={handleChange}
        />

        <div className="admin-product-form-actions">
          <button type="submit" disabled={loading}>
            {loading
              ? "Saqlanmoqda..."
              : editingId
              ? "O‘zgarishlarni saqlash"
              : "Brend qo‘shish"}
          </button>

          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <div className="admin-products-table">
        <h3>Barcha brendlar</h3>

        <div className="admin-products-list">
          {brands.map((brand) => (
            <div className="admin-product-item" key={brand.id}>
              <div className="admin-product-info">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} />
                ) : (
                  <div className="admin-product-placeholder">🏷️</div>
                )}

                <div>
                  <strong>{brand.name}</strong>
                  <p>{brand.description || "Tavsif mavjud emas"}</p>
                </div>
              </div>

              <div className="admin-product-actions">
                <button onClick={() => handleEdit(brand)}>
                  Tahrirlash
                </button>

                <button onClick={() => handleDelete(brand.id)}>
                  O‘chirish
                </button>
              </div>
            </div>
          ))}

          {brands.length === 0 && (
            <p>Hozircha brendlar mavjud emas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBrands;