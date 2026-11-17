
import "./Cart.css";

function formatPrice(price) {
  return (
    new Intl.NumberFormat("uz-UZ").format(Number(price) || 0) +
    " so'm"
  );
}

function Cart({
  open,
  onClose,
  cart,
  onChangeQuantity,
  onRemove,
  onCheckout,
}) {
  if (!open) return null;

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div
        className="cart-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-header">
          <div>
            <span className="cart-label">SIZNING TANLOVINGIZ</span>
            <h2>Savatcha</h2>
            <p>{cartCount} ta mahsulot</p>
          </div>

          <button className="cart-close" onClick={onClose}>
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span>🛒</span>
            <h3>Savatingiz hozircha bo‘sh</h3>
            <p>Yoqtirgan mahsulotlaringizni savatga qo‘shing.</p>

            <button onClick={onClose}>
              Xaridni davom ettirish
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.cartId}>
                  <img
                    src={
                      item.image ||
                      "https://placehold.co/150x150?text=TECHZONE"
                    }
                    alt={item.name}
                  />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <strong>{formatPrice(item.price)}</strong>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          onChangeQuantity(item, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          onChangeQuantity(item, item.quantity + 1)
                        }
                        disabled={item.quantity >= Number(item.stock)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <strong>
                      {formatPrice(
                        Number(item.price) * item.quantity
                      )}
                    </strong>

                    <button
                      className="remove-cart-item"
                      onClick={() => onRemove(item.cartId)}
                    >
                      O‘chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-total">
              <span>Umumiy summa</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>

            <button
              className="cart-checkout"
              onClick={onCheckout}
            >
              Buyurtma berish →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;