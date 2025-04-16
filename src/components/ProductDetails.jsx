import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  const relatedProducts = [
    { artwork_id: 3, title: 'Safari Hat', images: [{ image_url: 'hat.jpg', is_primary: true }] },
    { artwork_id: 4, title: 'Wood Carving', images: [{ image_url: 'carving.jpg', is_primary: true }] },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/arts/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const productData = {
          ...response.data,
          price: parseFloat(response.data.price) || 0,
        };
        setProduct(productData);
        const primaryImage = productData.images?.find((img) => img.is_primary) || productData.images?.[0];
        setSelectedImage(primaryImage);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.response?.data?.error || 'Failed to load product details');
      }
    };
    fetchProduct();

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find((item) => item.artwork_id === product.artwork_id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartItems(cart); // Update state for cart count
      setCartMessage(`${product.title} added to cart!`);
      setTimeout(() => setCartMessage(''), 3000);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div>Loading...</div>;

  return (
    <div className={`product-details-page ${isDarkMode ? 'dark' : 'light'}`}>
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
        <div className="main-content">
          <div className="side-panel">
            <h3>Delivery & Returns</h3>
            <label>Choose Location:</label>
            <select>
              <option value="nairobi">Nairobi</option>
              <option value="mombasa">Mombasa</option>
              <option value="kisumu">Kisumu</option>
            </select>
            <p><strong>Delivery Cost:</strong> KSh 200</p>
            <p><strong>Return Policy:</strong> 30-day returns</p>
          </div>
          <div className="product-content">
            <div className="product-header">
              {selectedImage && (
                <img src={selectedImage.image_url} alt={product.title} className="main-image" />
              )}
              <div className="image-thumbnails">
                {product.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`${product.title} - ${index + 1}`}
                    className={`thumbnail ${selectedImage === image ? 'selected' : ''}`}
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>
              <div className="product-info">
                <h1>{product.title}</h1>
                <p className="price">${Number(product.price).toFixed(2)}</p>
                <button onClick={handleAddToCart}>Add to Cart</button>
                {cartMessage && <p className="cart-message">{cartMessage}</p>}
              </div>
            </div>

            <section className="product-details">
              <h2>Product Details</h2>
              <p>{product.description || 'No description available'}</p>
            </section>

            <section className="related-products">
              <h2>Related Products</h2>
              <div className="product-grid">
                {relatedProducts.map((item) => (
                  <div key={item.artwork_id} className="related-item">
                    <img src={item.images[0].image_url} alt={item.title} />
                    <p>{item.title}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-text">
            <p>&copy; 2025 The Kenyan Culture. All rights reserved.</p>
          </div>
          <div className="social-icons">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;