import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AuthStyles.css';
import kenyanShield from '../images/logo.png';
import loginside from '../images/login.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors([]);
    setSuccess('');
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.username || formData.username.length < 3) {
      newErrors.push('Username must be at least 3 characters long');
    }
    if (formData.email !== formData.confirmEmail) {
      newErrors.push('Emails do not match');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }
    if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters long');
    }
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');
    setLoading(true);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const { username, email, password } = formData;
      const response = await axios.post('http://localhost:5000/api/admin/register', {
        username,
        email,
        password,
      });

      setSuccess(response.data.message + ' (Code expires in 15 minutes)');
      setShowPopup(true);
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      const errorData = error.response?.data;
      console.error('Registration error:', errorData);
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else if (errorData?.message) {
        setErrors([errorData.message]);
      } else {
        setErrors(['An unexpected error occurred. Please try again.']);
      }
    } finally {
      setLoading(false); // Ensure loading resets
    }
  };

  const handleConfirm = async () => {
    setErrors([]);
    setSuccess('');
    setLoading(true);

    if (!confirmationCode) {
      setErrors(['Confirmation code is required']);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/admin/confirm', {
        email: formData.email,
        code: confirmationCode,
      });

      setSuccess(response.data.message);
      setShowPopup(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorData = error.response?.data;
      console.error('Confirmation error:', errorData);
      if (errorData?.message) {
        setErrors([errorData.message]);
      } else {
        setErrors(['An unexpected error occurred during confirmation.']);
      }
    } finally {
      setLoading(false); // Ensure loading resets even on error
    }
  };

  // Auto-check confirmation code when it reaches 6 characters (length of crypto.randomBytes(3).toString('hex'))
  useEffect(() => {
    if (confirmationCode.length === 6 && showPopup) {
      handleConfirm();
    }
  }, [confirmationCode, showPopup]);

  const handleCodeChange = (e) => {
    const value = e.target.value;
    setConfirmationCode(value);
    setErrors([]);
    setSuccess('');
  };

  const PasswordInput = ({ name, placeholder, value, show, toggleShow }) => (
    <div className="password-container">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
      />
      <FontAwesomeIcon
        icon={show ? faEyeSlash : faEye}
        className="eye-icon"
        onClick={toggleShow}
      />
    </div>
  );

  return (
    <div className="auth-wrapper-register">
      <div className="auth-image">
        <img src={loginside} alt="Login Background" />
      </div>
      <div className="auth-container">
        <div className="auth-header">
          <img src={kenyanShield} alt="Kenyan Shield" />
        </div>
        <h2>Register</h2>

        {!showPopup && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="confirmEmail"
              placeholder="Confirm Email"
              value={formData.confirmEmail}
              onChange={handleChange}
              required
            />
            <PasswordInput
              name="password"
              placeholder="Password"
              value={formData.password}
              show={showPassword}
              toggleShow={() => setShowPassword(!showPassword)}
            />
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        {showPopup && (
          <div className="confirmation-popup">
            <h3>Confirm Your Email</h3>
            <p>{success}</p>
            <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
              <input
                type="text"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={handleCodeChange}
                maxLength="6" // Match backend code length
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm'}
              </button>
            </form>
          </div>
        )}

        {errors.length > 0 && (
          <ul className="error-list">
            {errors.map((error, index) => (
              <li key={index} className="error">
                ❌ {error}
              </li>
            ))}
          </ul>
        )}
        {success && !showPopup && <p className="success">{success}</p>}

        {!showPopup && (
          <Link to="/login">Already have an account? Login</Link>
        )}
      </div>
    </div>
  );
};

export default Register;