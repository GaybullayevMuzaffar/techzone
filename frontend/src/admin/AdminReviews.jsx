
import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminReviews.css";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await api.get("/reviews");
      setReviews(response.data.data || []);
    } catch (error) {
      console.error("Sharhlarni olishda xatolik:", error);
      alert("Sharhlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id) => {
    const confirmDelete = window.confirm(
      "Bu sharhni o'chirmoqchimisiz?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/reviews/${id}`);
      alert("Sharh o'chirildi!");
      fetchReviews();
    } catch (error) {
      console.error(error);
      alert("Sharhni o'chirishda xatolik yuz berdi");
    }
  };

  if (loading) {
    return <div className="reviews-admin">Yuklanmoqda...</div>;
  }

  return (
    <div className="reviews-admin">
      <div className="reviews-admin-heading">
        <div>
          <h2>Mijozlar sharhlari</h2>
          <p>Mijozlarning fikrlari va baholarini boshqaring</p>
        </div>

        <div className="reviews-admin-total">
          <span>Jami sharhlar</span>
          <strong>{reviews.length}</strong>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="reviews-admin-empty">
          Hozircha sharhlar mavjud emas.
        </div>
      ) : (
        <div className="reviews-admin-list">
          {reviews.map((review) => (
            <div className="review-admin-card" key={review.id}>
              <div className="review-admin-top">
                <div className="review-admin-avatar">👤</div>

                <div className="review-admin-info">
                  <h3>Sharh #{review.id}</h3>
                  <span>ID: {review.id}</span>
                </div>

                <div className="review-admin-rating">
                  {"⭐".repeat(
                    Math.min(5, Math.max(0, Number(review.rating) || 0))
                  )}
                  <span>{review.rating}/5</span>
                </div>
              </div>

              <div className="review-admin-comment">
                {review.comment}
              </div>

              <div className="review-admin-actions">
                <button onClick={() => deleteReview(review.id)}>
                  🗑 O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReviews;