
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Reviews.css";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [reviewsRes, productsRes] = await Promise.all([
        api.get("/reviews"),
        api.get("/products"),
      ]);

      setReviews(reviewsRes.data.data || []);
      setProducts(productsRes.data.data || []);
    } catch (err) {
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !comment.trim()) {
      setError("Mahsulot va izohni kiriting.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const reviewData = {
        productId: Number(productId),
        rating: Number(rating),
        comment,
      };

      if (editingId) {
        await api.put(`/reviews/${editingId}`, {
          rating: Number(rating),
          comment,
        });
      } else {
        await api.post("/reviews", reviewData);
      }

      setProductId("");
      setRating(5);
      setComment("");
      setEditingId(null);

      await fetchData();
    } catch (err) {
      setError(JSON.stringify(err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setProductId(review.productId);
    setRating(review.rating);
    setComment(review.comment || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ushbu sharhni o'chirmoqchimisiz?")) return;

    try {
      await api.delete(`/reviews/${id}`);
      await fetchData();
    } catch (err) {
      setError("Sharhni o'chirishda xatolik yuz berdi.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProductId("");
    setRating(5);
    setComment("");
    setError("");
  };

  return (
    <section className="reviews-page">
      <div className="reviews-header">
        <h1>Sharhlarim</h1>
        <p>Mahsulotlar haqidagi fikrlaringizni boshqalar bilan ulashing.</p>
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Sharhni tahrirlash" : "Yangi sharh"}</h2>

        <label>Mahsulot</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          disabled={Boolean(editingId)}
        >
          <option value="">Mahsulotni tanlang</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <label>Baho</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[5, 4, 3, 2, 1].map((number) => (
            <option key={number} value={number}>
              {number} / 5
            </option>
          ))}
        </select>

        <label>Izoh</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Mahsulot haqida fikringiz..."
          rows="4"
        />

        {error && <p className="review-error">{error}</p>}

        <div className="review-form-actions">
          <button type="submit" disabled={loading}>
            {loading
              ? "Saqlanmoqda..."
              : editingId
              ? "O'zgarishlarni saqlash"
              : "Sharh qoldirish"}
          </button>

          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <div className="reviews-list">
        <h2>Mening sharhlarim ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="reviews-empty">Hozircha sharhlaringiz yo'q.</p>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-card-top">
                <h3>
                  {review.product?.name || "Mahsulot"}
                </h3>
                <span>{review.rating} / 5 ⭐</span>
              </div>

              <p>{review.comment}</p>

              <div className="review-card-actions">
                <button onClick={() => handleEdit(review)}>
                  Tahrirlash
                </button>
                <button onClick={() => handleDelete(review.id)}>
                  O'chirish
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Reviews;