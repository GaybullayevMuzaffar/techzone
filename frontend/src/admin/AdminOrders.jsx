import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminProducts.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Buyurtmalarni olishda xatolik:", error);
      alert("Buyurtmalarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      alert("Buyurtma holati yangilandi!");
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Holatni yangilashda xatolik yuz berdi");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Bu buyurtmani o'chirmoqchimisiz?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/orders/${id}`);
      alert("Buyurtma o'chirildi!");
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Buyurtmani o'chirishda xatolik yuz berdi");
    }
  };

  const statusNames = {
    pending: "Kutilmoqda",
    confirmed: "Tasdiqlandi",
    shipped: "Yetkazishga chiqarildi",
    delivered: "Yetkazildi",
    cancelled: "Bekor qilindi",
  };

  if (loading) {
    return <div className="admin-products">Yuklanmoqda...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-products-heading">
        <h2>Buyurtmalar</h2>
        <p>Barcha mijozlar buyurtmalarini boshqarish</p>
      </div>

      {orders.length === 0 ? (
        <p>Hozircha buyurtmalar mavjud emas.</p>
      ) : (
        <div className="admin-products-list">
          {orders.map((order) => (
            <div className="admin-product-item" key={order.id}>
              <div className="admin-product-info">
                <h3>Buyurtma #{order.id}</h3>
                <p>
                  Umumiy narx:{" "}
                  {Number(order.totalPrice).toLocaleString("uz-UZ")} so'm
                </p>
                <p>Telefon: {order.phone}</p>
                <p>Manzil: {order.address}</p>
                <p>
                  Holati: {statusNames[order.status] || order.status}
                </p>
              </div>

              <div className="admin-product-actions">
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                >
                  <option value="pending">Kutilmoqda</option>
                  <option value="confirmed">Tasdiqlandi</option>
                  <option value="shipped">Yetkazishga chiqarildi</option>
                  <option value="delivered">Yetkazildi</option>
                  <option value="cancelled">Bekor qilindi</option>
                </select>

                <button onClick={() => deleteOrder(order.id)}>
                  O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;