import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-brand">
          <span className="brand-icon">🌐</span>
          <span className="brand-text">Tangle</span>
        </Link>

        {isAuthenticated ? (
          <>
            <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">🏠</span>
                Dashboard
              </Link>
              <Link to="/create-post" className="nav-link">
                <span className="nav-icon">➕</span>
                Create Post
              </Link>
              <Link to="/profile" className="nav-link">
                <span className="nav-icon">👤</span>
                Profile
              </Link>
            </div>

            <div className="navbar-user">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-name">{user?.full_name || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="auth-link login-link">
              <span className="auth-icon">🔑</span>
              Login
            </Link>
            <Link to="/register" className="auth-link register-link">
              <span className="auth-icon">📝</span>
              Sign Up
            </Link>
          </div>
        )}

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className="hamburger">☰</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 