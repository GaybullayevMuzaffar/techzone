
import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Foydalanuvchilarni olishda xatolik:", error);
      alert("Foydalanuvchilarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      alert("Foydalanuvchi roli yangilandi!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Rolni o'zgartirishda xatolik yuz berdi");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Bu foydalanuvchini o'chirmoqchimisiz?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}`);
      alert("Foydalanuvchi o'chirildi!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Foydalanuvchini o'chirishda xatolik yuz berdi");
    }
  };

  if (loading) {
    return <div className="admin-products">Yuklanmoqda...</div>;
  }

  
return (
  <div className="users-page">
    <div className="users-heading">
      <div>
        <h2>Foydalanuvchilar</h2>
        <p>Platformadagi barcha foydalanuvchilarni boshqaring</p>
      </div>
      <div className="users-total">
        <span>Jami foydalanuvchilar</span>
        <strong>{users.length}</strong>
      </div>
    </div>

    <div className="users-list">
      {users.length === 0 ? (
        <p className="users-empty">Hozircha foydalanuvchilar mavjud emas.</p>
      ) : (
        users.map((user) => (
          <div className="user-card" key={user.id}>
            <div className="user-avatar">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <span className="user-id">ID: #{user.id}</span>
            </div>

            <div className="user-controls">
              <span className={`user-role ${user.role}`}>
                {user.role === "admin" ? "Administrator" : "Foydalanuvchi"}
              </span>

              <select
                value={user.role}
                onChange={(e) => updateRole(user.id, e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button
                className="user-delete"
                onClick={() => deleteUser(user.id)}
              >
                O'chirish
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}

export default AdminUsers;