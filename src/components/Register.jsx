// src/components/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // State for controlling the modal

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      // Register user and send confirmation email
      const response = await axios.post('http://localhost:5000/api/admin/register', {
        username,
        email,
        password,
      });
      
      setIsConfirmationSent(true);
      setShowModal(true); // Show the modal after successful registration
      setErrorMessage(''); // Clear any previous error messages
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const handleConfirmEmail = async (e) => {
    e.preventDefault();

    try {
      // Confirm email with the provided code
      const response = await axios.post('http://localhost:5000/api/admin/confirm', {
        email,
        code: confirmationCode,
      });
      setErrorMessage('');
      alert(response.data); // Show success message
      // Reset form after successful confirmation
      resetForm();
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setConfirmationCode('');
    setShowModal(false); // Close the modal
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Modal for Email Confirmation */}
      {showModal && (
        <div className="modal">
          <h3>Email Confirmation</h3>
          <p>Please enter the confirmation code sent to your email.</p>
          <form onSubmit={handleConfirmEmail}>
            <div>
              <label>Confirmation Code:</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
            </div>
            <button type="submit">Confirm Email</button>
            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
          </form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Register;
