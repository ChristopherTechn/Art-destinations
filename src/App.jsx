import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register'; // Ensure these are .jsx files
import Login from './components/Login'; // Ensure these are .jsx files
import Dashboard from './components/Dashboard'; // Assuming you have a dashboard component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* This should be protected, see next step */}
      </Routes>
    </Router>
  );
};

export default App;
