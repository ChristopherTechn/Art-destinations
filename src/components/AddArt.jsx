import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddArt.css';
import kenyanCultureImage from '../images/addart.jpg';

const AddArt = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        artist_name: '',
        price: '',
        description: '',
    });
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        return JSON.parse(localStorage.getItem('cart')) || [];
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const newImages = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...newImages]);
    };

    const handleDeleteImage = (indexToDelete) => {
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToDelete));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to add artwork');
            return;
        }
        if (images.length === 0) {
            setMessage('Please select at least one image');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));
        images.forEach((image) => data.append('images', image));

        try {
            const response = await axios.post('http://localhost:5000/api/addart', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setMessage(response.data.message);
            setFormData({ title: '', artist_name: '', price: '', description: '' });
            setImages([]);
        } catch (error) {
            console.error('Error adding artwork:', error.response?.data || error.message);
            setMessage(error.response?.data?.error || 'Failed to add artwork');
        }
    };

    // Toggle dark/light mode
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
        document.body.classList.toggle('dark-mode', !isDarkMode);
    };

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    return (
        <div className={`add-art-page ${isDarkMode ? 'dark' : 'light'}`}>
            <header className="dashboard-header">
                <h1 className="kenyan-title">THE KENYAN CULTURE</h1>
                <div className="header-buttons">
                    <Link to="/articles"><button>View Articles</button></Link>
                    <Link to="/dashboard"><button>Dashboard</button></Link>
                    <button onClick={toggleDarkMode}>
                        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>
                    <Link to="/cart" className="cart-link">
                        <button>Cart ({cartItems.length})</button>
                    </Link>
                </div>
            </header>

            <div className="add-art-container">
                <div className="side-image">
                    <img src={kenyanCultureImage} alt="Kenyan Culture" />
                </div>
                <div className="add-art">
                    <h2>Add New Artwork</h2>
                    <form onSubmit={handleSubmit} className="add-art-form">
                        <div className="form-left">
                            <div>
                                <label>Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Artist Name:</label>
                                <input
                                    type="text"
                                    name="artist_name"
                                    value={formData.artist_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Price:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div>
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-right">
                            <div>
                                <label>Images:</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="image-preview">
                                {images.map((image, index) => (
                                    <div key={index} className="image-item">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="submit-btn">Add Artwork</button>
                        </div>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default AddArt;