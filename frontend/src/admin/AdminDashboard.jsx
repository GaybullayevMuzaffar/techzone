import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminBrands from "./AdminBrands";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminReviews from "./AdminReviews";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProductCount(response.data.data.length);
    } catch (error) {
      console.log("Mahsulotlarni olishda xatolik:", error);
    }
  };

  const fetchOrders = async () => {
  try {
    const response = await api.get("/orders");
    const orders = response.data.data || [];

    setOrderCount(orders.length);

    // Oxirgi 5 ta buyurtma
    setRecentOrders(orders.slice(-5).reverse());

    // Buyurtmalar holatini hisoblash
    setPendingOrders(
      orders.filter((order) => order.status === "pending").length
    );

    setDeliveredOrders(
      orders.filter((order) => order.status === "delivered").length
    );

    setCancelledOrders(
      orders.filter((order) => order.status === "cancelled").length
    );
  } catch (error) {
    console.log("Buyurtmalarni olishda xatolik:", error);
  }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUserCount(response.data.data.length);
    } catch (error) {
      console.log("Foydalanuvchilarni olishda xatolik:", error);
    }
  };

  const fetchTotalSales = async () => {
    try {
      const response = await api.get("/orders");
      const orders = response.data.data;

      const total = orders.reduce(
        (sum, order) => sum + Number(order.totalPrice),
        0
      );

      setTotalSales(total);
    } catch (error) {
      console.log("Savdo summasini hisoblashda xatolik:", error);
    }
  };

  fetchProducts();
  fetchOrders();
  fetchUsers();
  fetchTotalSales();
}, []);


  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">TECHZONE<span>.</span></div>

        <p className="admin-menu-title">BOSH MENYU</p>

        <nav className="admin-nav">
          <button
  className={`admin-nav-item ${
    activeTab === "Dashboard" ? "active" : ""
  }`}
  onClick={() => setActiveTab("Dashboard")}
>
  <span>▦</span> Dashboard
</button>

          <button
            className={`admin-nav-item ${
              activeTab === "Mahsulotlar" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Mahsulotlar")}
          >
            <span>📦</span> Mahsulotlar
          </button>

          <button
            className={`admin-nav-item ${
              activeTab === "Kategoriyalar" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Kategoriyalar")}
          >
            <span>🗂️</span> Kategoriyalar
          </button>

          <button
            className={`admin-nav-item ${
              activeTab === "Brendlar" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Brendlar")}
          >
            <span>🏷️</span> Brendlar
          </button>

          <button
            className={`admin-nav-item ${
              activeTab === "Buyurtmalar" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Buyurtmalar")}
          >
            <span>🛒</span> Buyurtmalar
          </button>

          <button
            className={`admin-nav-item ${
              activeTab === "Foydalanuvchilar" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Foydalanuvchilar")}
          >
            <span>👥</span> Foydalanuvchilar
          </button>

          <button
            className={`admin-nav-item ${
              activeTab === "Sharhlar" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Sharhlar")}
          >
            <span>⭐</span> Sharhlar
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <p>TECHZONE ADMIN</p>
          <span>Control Panel</span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Do‘koningiz faoliyatini boshqaring</p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {activeTab === "Dashboard" && (
        <>
        <section className="admin-welcome">
          <div>
            <span>ADMIN PANEL</span>
            <h2>Xush kelibsiz!</h2>
            <p>TECHZONE boshqaruv paneliga xush kelibsiz.</p>
          </div>
        </section>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <span>Jami mahsulotlar</span>
            <h2>{productCount}</h2>
            <p>Mahsulotlar soni</p>
          </div>

          <div className="admin-stat-card">
            <span>Jami buyurtmalar</span>
            <h2>{orderCount}</h2>
            <p>Barcha buyurtmalar</p>
          </div>

          <div className="admin-stat-card">
            <span>Foydalanuvchilar</span>
            <h2>{userCount}</h2>
            <p>Ro‘yxatdan o‘tganlar</p>
          </div>

          <div className="admin-stat-card">
            <span>Jami savdo</span>
            <h2>{totalSales.toLocaleString("uz-UZ")} so'm</h2>
            <p>Buyurtmalar qiymati</p>
          </div>
        </section>

        <section className="admin-content-card">
  <h3>Buyurtmalar holati</h3>

  <div className="admin-stats-grid">
    <div className="admin-stat-card">
      <h4>Kutilmoqda</h4>
      <p>{pendingOrders}</p>
    </div>

    <div className="admin-stat-card">
      <h4>Yetkazildi</h4>
      <p>{deliveredOrders}</p>
    </div>

    <div className="admin-stat-card">
      <h4>Bekor qilindi</h4>
      <p>{cancelledOrders}</p>
    </div>
  </div>
</section>

<section className="admin-content-card">
  <h3>Oxirgi buyurtmalar</h3>

  {recentOrders.length === 0 ? (
    <p>Hozircha buyurtmalar mavjud emas.</p>
  ) : (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Telefon</th>
            <th>Manzil</th>
            <th>Summa</th>
            <th>Holati</th>
          </tr>
        </thead>

        <tbody>
          {recentOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>
                {Number(order.totalPrice).toLocaleString("uz-UZ")} so‘m
              </td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>
        </>
        )}

        {activeTab === "Mahsulotlar" && <AdminProducts />}
        {activeTab === "Kategoriyalar" && <AdminCategories />}
        {activeTab === "Brendlar" && <AdminBrands />}
        {activeTab === "Buyurtmalar" && <AdminOrders />}
        {activeTab === "Foydalanuvchilar" && <AdminUsers />}
        {activeTab === "Sharhlar" && <AdminReviews />}
      </main>
    </div>
  );
}

export default AdminDashboard;