import { useEffect, useState } from "react";
import api from "../services/api";
import "./Order.css";

function formatPrice(price) {
  return (
    new Intl.NumberFormat("uz-UZ").format(Number(price) || 0) +
    " so'm"
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data.data || []);
      } catch (err) {
        console.error("Buyurtmalarni yuklashda xatolik:", err);
        setError(
          err.response?.data?.message ||
          "Buyurtmalarni yuklashda xatolik yuz berdi."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="orders-message">Yuklanmoqda...</div>;
  }

  if (error) {
    return <div className="orders-message">{error}</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-heading">
        <span>TECHZONE ACCOUNT</span>
        <h1>Buyurtmalarim</h1>
        <p>Barcha xaridlaringiz va buyurtmalaringiz tarixi.</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <span>📦</span>
          <h2>Hozircha buyurtmalar yo‘q</h2>
          <p>Birinchi xaridingizni amalga oshiring.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span>BUYURTMA №{order.id}</span>
                  <h3>{formatPrice(order.totalPrice)}</h3>
                </div>

                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-details">
                <p>
                  <strong>Manzil:</strong> {order.address}
                </p>
                <p>
                  <strong>Telefon:</strong> {order.phone}
                </p>
                <p>
                  <strong>Mahsulotlar:</strong>{" "}
                  {order.items?.length || 0} ta
                </p>
              </div>

              {order.items?.length > 0 && (
                <div className="order-products">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-product">
                      <span>
                        {item.product?.name || "Mahsulot"}
                      </span>
                      <span>
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
