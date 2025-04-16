import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');

  const topSellingProducts = [
    { artwork_id: 5, title: 'Beaded Bracelet', image: 'bracelet.jpg', price: 10.00 },
    { artwork_id: 6, title: 'Kilimanjaro Painting', image: 'painting.jpg', price: 50.00 },
  ];

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (artwork_id, change) => {
    const updatedCart = cartItems.map((item) => {
      if (item.artwork_id === artwork_id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (artwork_id) => {
    const updatedCart = cartItems.filter((item) => item.artwork_id !== artwork_id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  const handleCheckout = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log(`Processing payment with ${selectedPaymentMethod}`);
    setShowPaymentForm(false);
    // Add actual payment processing logic here
  };

  return (
    <div className={`cart-page ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="dashboard-header">
        <h1 className="kenyan-title">THE KENYAN CULTURE</h1>
        <div className="header-buttons">
          <Link to="/dashboard"><button>Dashboard</button></Link>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Link to="/cart" className="cart-link">
            <button>Cart ({cartItems.length})</button>
          </Link>
        </div>
      </header>

      <div className="content-container">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>Your cart is empty. <Link to="/dashboard">Shop now</Link></p>
          ) : (
            <>
              {cartItems.map((item) => {
                const primaryImage = item.images?.find((img) => img.is_primary) || item.images?.[0];
                return (
                  <div key={item.artwork_id} className="cart-item">
                    {primaryImage && (
                      <Link to={`/product/${item.artwork_id}`} className="product-image-link">
                        <img src={primaryImage.image_url} alt={item.title} />
                      </Link>
                    )}
                    <div className="item-details">
                      <h3>{item.title}</h3>
                      <p>Price: ${Number(item.price).toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.artwork_id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.artwork_id, 1)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.artwork_id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="cart-total">
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>

        {showPaymentForm && (
          <div className="payment-modal">
            <div className="payment-form">
              <h2>Complete Your Payment</h2>
              <div className="payment-tabs">
                <button
                  className={selectedPaymentMethod === 'mpesa' ? 'active' : ''}
                  onClick={() => setSelectedPaymentMethod('mpesa')}
                >
                  M-Pesa
                </button>
                <button
                  className={selectedPaymentMethod === 'card' ? 'active' : ''}
                  onClick={() => setSelectedPaymentMethod('card')}
                >
                  Card
                </button>
                <button
                  className={selectedPaymentMethod === 'paypal' ? 'active' : ''}
                  onClick={() => setSelectedPaymentMethod('paypal')}
                >
                  PayPal
                </button>
                <button
                  className={selectedPaymentMethod === 'applepay' ? 'active' : ''}
                  onClick={() => setSelectedPaymentMethod('applepay')}
                >
                  Apple Pay
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                {selectedPaymentMethod === 'mpesa' && (
                  <div className="payment-method">
                    <label htmlFor="mpesa-number">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      id="mpesa-number"
                      placeholder="e.g., 254712345678"
                      required
                    />
                  </div>
                )}
                {selectedPaymentMethod === 'card' && (
                  <div className="payment-method">
                    <label htmlFor="card-number">Card Number</label>
                    <input
                      type="text"
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                    <div className="card-details">
                      <div>
                        <label htmlFor="expiry">Expiry Date</label>
                        <input type="text" id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div>
                        <label htmlFor="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
                {selectedPaymentMethod === 'paypal' && (
                  <div className="payment-method">
                    <label htmlFor="paypal-email">PayPal Email</label>
                    <input
                      type="email"
                      id="paypal-email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                )}
                {selectedPaymentMethod === 'applepay' && (
                  <div className="payment-method">
                    <p>Click "Pay with Apple Pay" to proceed using your Apple device.</p>
                  </div>
                )}
                <div className="payment-actions">
                  <button type="submit" className="pay-btn">
                    Pay ${totalPrice.toFixed(2)}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="top-selling">
          <h2>Top Selling Products</h2>
          <div className="product-grid">
            {topSellingProducts.map((product) => (
              <Link to={`/product/${product.artwork_id}`} key={product.artwork_id} className="product-item">
                <img src={`/images/${product.image}`} alt={product.title} />
                <p>{product.title}</p>
                <p>${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;