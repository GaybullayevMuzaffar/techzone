import { useState } from "react";
import "./Checkout.css";

function Checkout({ open, onClose, onSubmit, loading, totalPrice }) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address.trim() || !phone.trim()) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    onSubmit({
      address: address.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div
        className="checkout-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="checkout-header">
          <div>
            <span>TECHZONE CHECKOUT</span>
            <h2>Buyurtmani rasmiylashtirish</h2>
            <p>Yetkazib berish ma’lumotlarini kiriting.</p>
          </div>

          <button
            className="checkout-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="checkout-address">
            Yetkazib berish manzili
          </label>

          <textarea
            id="checkout-address"
            placeholder="Viloyat, shahar, ko'cha, uy..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
          />

          <label htmlFor="checkout-phone">
            Telefon raqami
          </label>

          <input
            id="checkout-phone"
            type="tel"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="checkout-summary">
            <span>Umumiy summa</span>
            <strong>
              {new Intl.NumberFormat("uz-UZ").format(
                Number(totalPrice) || 0
              )}{" "}
              so'm
            </strong>
          </div>

          <button
            className="checkout-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;