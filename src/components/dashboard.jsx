import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import adImage1 from '../images/image1.jpg';
import adImage2 from '../images/image2.png';
import adImage3 from '../images/image3.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const ads = [adImage1, adImage2, adImage3];

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/arts', {
        withCredentials: true,
      });
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  useEffect(() => {
    fetchProducts();
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);

    const adInterval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);

    return () => clearInterval(adInterval);
  }, []);

  return (
    <div className={`dashboard ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="dashboard-header">
        <h1 className="kenyan-title">THE KENYAN CULTURE</h1>
        <div className="header-buttons">
          <Link to="/articles"><button>View Articles</button></Link>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/addart"><button>Post a Product</button></Link>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
          <Link to="/cart" className="cart-link">
            <button>Cart ({cartItems.length})</button>
          </Link>
        </div>
      </header>

      <div className="content-container">
        <div className="ad-banner">
          <img src={ads[currentAdIndex]} alt={`Advertisement ${currentAdIndex + 1}`} />
        </div>

        <div className="arts">
          <h2>Kenya to the World</h2>
          <div className="arts-list">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => {
                const images = Array.isArray(product.images) ? product.images : [];
                const primaryImage = images.find((img) => img.is_primary) || images[0] || null;
                return (
                  <Link
                    to={`/product/${product.artwork_id}`}
                    key={product.artwork_id}
                    className="art-card"
                  >
                    {primaryImage ? (
                      <img src={primaryImage.image_url} alt={product.title} />
                    ) : (
                      <div className="no-image">No Image Available</div>
                    )}
                    <h3>{product.title}</h3>
                    <p>
                      {product.description && typeof product.description === 'string'
                        ? product.description.length > 50
                          ? `${product.description.slice(0, 50)}...`
                          : product.description
                        : 'No description available'}
                    </p>
                    <p>Price: ${product.price}</p>
                  </Link>
                );
              })
            ) : (
              <p>No products available</p>
            )}
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

export default Dashboard;