import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import maasaiMaraImage from '../images/beach.jpeg';
import kenyaDefaultImage from '../images/lion.jpeg';
import Chatbot from '../components/Chatbot';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    duration: '',
    status: '',
  });
  const navigate = useNavigate();

  const imageMap = {
    'Maasai Mara': maasaiMaraImage,
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/destination');
        setDestinations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations');
        setLoading(false);
      }
    };
    fetchDestinations();

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      dest.price >= filters.priceRange[0] && dest.price <= filters.priceRange[1];
    const matchesDuration = filters.duration ? dest.duration === filters.duration : true;
    const matchesStatus = filters.status ? dest.status === filters.status : true;
    return matchesSearch && matchesPrice && matchesDuration && matchesStatus;
  });

  const handleCardClick = (id) => {
    navigate(`/booking/${id}`);
  };

  if (loading) return <div className="loading">Loading destinations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`destinations-page ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="dashboard-header">
        <h1 className="kenyan-title">THE KENYAN CULTURE</h1>
        <div className="header-buttons">
          <Link to="/dashboard"><button>Dashboard</button></Link>
          <Link to="/cart"><button>Cart ({cartItems.length})</button></Link>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <div className="content-container">
        <div className="hero-section">
          <img src={kenyaDefaultImage} alt="Kenya" />
          <h1>Discover Kenya</h1>
          <div className="trip-details">
            <a href="#pricing">$450.00 per person</a> | <a href="#group">2 Adults</a> |{' '}
            <a href="#accommodation">3-Star Hotel Stay</a> |{' '}
            <a href="#meals">Daily Breakfast Plan</a>
          </div>
        </div>

        <div className="main-content">
          <div className="filter-sidebar">
            <h3>Filter Destinations</h3>
            <div className="filter-group">
              <label>Search:</label>
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Price Range:</label>
              <input
                type="number"
                name="priceMin"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [Number(e.target.value), prev.priceRange[1]],
                  }))
                }
              />
              <input
                type="number"
                name="priceMax"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], Number(e.target.value)],
                  }))
                }
              />
            </div>
            <div className="filter-group">
              <label>Duration:</label>
              <select name="duration" onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="3 days">3 Days</option>
                <option value="5 days">5 Days</option>
                <option value="7 days">7 Days</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select name="status" onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </div>
          </div>

          <div className="destinations-list">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="destination-card"
                onClick={() => handleCardClick(dest.id)}
              >
                <div className="image-container">
                  <img
                    src={
                      imageMap[dest.name] ||
                      dest.images?.find((img) => img.is_primary)?.image_url ||
                      kenyaDefaultImage
                    }
                    alt={dest.name}
                  />
                </div>
                <div className="card-content">
                  <h2>{dest.name}</h2>
                  <p className="description">{dest.description}</p>
                  <p className="details">
                    <strong>Price:</strong> ${dest.price.toFixed(2)} |{' '}
                    <strong>Duration:</strong> {dest.duration}
                  </p>
                  <p className="activities">
                    <strong>Activities:</strong> {dest.activities.join(', ')}
                  </p>
                  <p className="status">
                    <strong>Status:</strong>{' '}
                    <span className={dest.status.toLowerCase()}>{dest.status}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <p><strong>Trip:</strong> Safari Extravaganza</p>
            <p><strong>Date:</strong> Jan 2026</p>
            <p><strong>Price:</strong> $600/person</p>
            <button>Book Now</button>
          </div>
        </div>

        <section className="testimonials">
          <h2>What Travelers Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial-item">
              <p>"An unforgettable safari experience!"</p>
              <span>- Jane K.</span>
            </div>
            <div className="testimonial-item">
              <p>"The best trip I’ve ever taken."</p>
              <span>- Paul M.</span>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-text">
            <p>© 2025 The Kenyan Culture. All rights reserved.</p>
          </div>
          <div className="social-icons">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default Destinations;