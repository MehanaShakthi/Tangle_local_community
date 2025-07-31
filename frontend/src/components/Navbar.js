import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'var(--bg-primary)',
      boxShadow: 'var(--shadow)',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Link to="/dashboard" style={{
            textDecoration: 'none',
            color: 'var(--primary-color)',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            🧱 Tangle
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
              🏠 Dashboard
            </Link>
            <Link to="/create-post" className="btn btn-accent" style={{ padding: '8px 16px' }}>
              ➕ Create Post
            </Link>
            
            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '2px solid var(--border-color)',
                  fontSize: '14px'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                {user?.fullName || 'User'}
                <span style={{ fontSize: '0.8rem' }}>▼</span>
              </button>

              {isMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  boxShadow: 'var(--shadow-hover)',
                  minWidth: '200px',
                  zIndex: 1001,
                  marginTop: '5px'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                      {user?.fullName}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {user?.email || user?.phoneNumber}
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    style={{
                      display: 'block',
                      padding: '12px 15px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      borderBottom: '1px solid var(--border-color)'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 15px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'var(--error-color)',
                      fontSize: '14px'
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        <div style={{
          display: isMenuOpen ? 'block' : 'none',
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link 
              to="/dashboard" 
              className="btn btn-secondary" 
              style={{ textAlign: 'center' }}
              onClick={() => setIsMenuOpen(false)}
            >
              🏠 Dashboard
            </Link>
            <Link 
              to="/create-post" 
              className="btn btn-accent" 
              style={{ textAlign: 'center' }}
              onClick={() => setIsMenuOpen(false)}
            >
              ➕ Create Post
            </Link>
            <Link 
              to="/profile" 
              className="btn btn-secondary" 
              style={{ textAlign: 'center' }}
              onClick={() => setIsMenuOpen(false)}
            >
              👤 Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="btn"
              style={{ 
                background: 'var(--error-color)', 
                color: 'white',
                textAlign: 'center'
              }}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 