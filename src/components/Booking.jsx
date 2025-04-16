import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import kenyaDefaultImage from '../images/lion.jpeg';
import './Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  const isLoggedIn = !!localStorage.getItem('token');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    adults: 1,
    children: 0,
    specialRequests: '',
  });

  const relatedDestinations = [
    { id: 2, name: 'Amboseli National Park', image: kenyaDefaultImage, price: 500 },
    { id: 3, name: 'Lamu Island', image: kenyaDefaultImage, price: 300 },
  ];

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/destination`);
        const dest = response.data.find((d) => d.id === parseInt(id));
        if (!dest) throw new Error('Destination not found');
        setDestination(dest);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError('Failed to load destination details');
        setLoading(false);
      }
    };
    fetchDestination();

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        destinationId: id,
        travelDate: formData.travelDate,
        adults: formData.adults,
        children: formData.children,
        specialRequests: formData.specialRequests,
      };

      if (!isLoggedIn) {
        payload.fullName = formData.fullName;
        payload.email = formData.email;
        payload.phone = formData.phone;
      }

      await axios.post('http://localhost:5000/api/bookings', payload, {
        headers: isLoggedIn ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {},
      });

      setBookingMessage('Booking successful! We’ll contact you soon.');
      alert('Your application has been received and approved. You can proceed to make your payment.');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('Error submitting booking:', err);
      setBookingMessage('Booking failed. Please try again.');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!destination) return <div className="error">Destination not found</div>;

  return (
    <div className={`booking-page ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="dashboard-header">
        <h1 className="kenyan-title">THE KENYAN CULTURE</h1>
        <div className="header-buttons">
          <Link to="/dashboard"><button>Dashboard</button></Link>
          <Link to="/destinations"><button>Destinations</button></Link>
          <Link to="/cart"><button>Cart ({cartItems.length})</button></Link>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <div className="content-container">
        <h1>Book Your Trip to {destination.name}</h1>
        <div className="main-content">
          <div className="trip-details">
            <div className="images">
              {destination.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.image_url || kenyaDefaultImage}
                  alt={`${destination.name} ${idx + 1}`}
                />
              ))}
            </div>
            <div className="info">
              <p><strong>Description:</strong> {destination.description}</p>
              <p><strong>Price:</strong> ${destination.price.toFixed(2)} per person</p>
              <p><strong>Duration:</strong> {destination.duration}</p>
              <p><strong>Activities:</strong> {destination.activities.join(', ')}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={destination.status.toLowerCase()}>{destination.status}</span>
              </p>
              <p><strong>Inclusions:</strong> Accommodation (3-star hotel), Daily Breakfast, Guided Tours</p>
              <p>
                <strong>Notes:</strong> Travel insurance recommended. Prices subject to change. Minimum 2 travelers.
              </p>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <h2>Booking Details</h2>
            {!isLoggedIn && (
              <>
                <label>
                  Full Name:
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Phone Number:
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </>
            )}
            <label>
              Travel Date:
              <input
                type="date"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Number of Adults:
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleInputChange}
                min="1"
                required
              />
            </label>
            <label>
              Number of Children:
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleInputChange}
                min="0"
              />
            </label>
            <label>
              Special Requests:
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Confirm Booking</button>
            {bookingMessage && (
              <p className={bookingMessage.includes('successful') ? 'success' : 'error'}>
                {bookingMessage}
              </p>
            )}
          </form>
        </div>

        <section className="related-destinations">
          <h2>Explore More Destinations</h2>
          <div className="destination-grid">
            {relatedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="destination-item"
                onClick={() => navigate(`/booking/${dest.id}`)}
              >
                <img src={dest.image} alt={dest.name} />
                <p>{dest.name}</p>
                <p>${dest.price.toFixed(2)}</p>
              </div>
            ))}
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
    </div>
  );
};

export default Booking;