import React, { useState } from 'react';
import axios from 'axios';

const ConfirmationModal = ({ email, setShowModal }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirm = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/confirm', {
        email,
        code,
      });

      if (response.status === 200) {
        setMessage('✅ Email confirmed! You can now log in.');
        setTimeout(() => setShowModal(false), 2000); // Close modal after success
      }
    } catch (error) {
      setMessage(error.response?.data || '❌ Invalid or expired code.');
    }
  };

  return (
    <div className="modal">
      <h3>Confirm Your Email</h3>
      <p>Enter the confirmation code sent to {email}</p>
      <input 
        type="text" 
        placeholder="Enter confirmation code" 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
      />
      <button onClick={handleConfirm}>Confirm</button>
      {message && <p>{message}</p>}
      <button onClick={() => setShowModal(false)}>Close</button>
    </div>
  );
};

export default ConfirmationModal;
