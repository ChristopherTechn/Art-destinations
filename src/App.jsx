import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register'; // Ensure .jsx extension if needed
import Login from './components/Login'; // Ensure .jsx extension if needed
import Dashboard from './components/dashboard';
import ArticlesPage from './components/Articles';
import AddArt from './components/AddArt';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Destinations from './components/Destinations';
import Booking from './components/Booking';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));



  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route
          path="/addart"
          element={isLoggedIn ? <AddArt /> : <Navigate to="/login" />}
        />
        {/* Optional: Redirect root path */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
        <Route
          path="/product/:id"
          element={isLoggedIn ? <ProductDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
       
        <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />

        <Route path="/discover" element={isLoggedIn ? <Destinations /> : <Navigate to="/login" />} />

        <Route
          path="/booking/:id"
          element={isLoggedIn ? <Booking /> : <Navigate to="/login" />}
        />
      </Routes>
      
    </Router>
  );
};

export default App;