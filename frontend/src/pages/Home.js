import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>🧱 Welcome to Tangle</h1>
          <p>Connect. Support. Grow – Together.</p>
          <p>Join your local community and build meaningful connections with your neighbors.</p>
          
          <div className="hero-buttons">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary">
                  Join Your Community
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="text-center mb-4">Why Choose Tangle?</h2>
          <p className="text-center text-secondary mb-4">
            A vibrant platform designed specifically for local communities, 
            helping residents connect, support each other, and grow together.
          </p>
          
          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">🆘</div>
              <h3>Help & Support</h3>
              <p>Post help requests or offer assistance to your neighbors. From blood donations to pet sitting, find the help you need.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">🛍️</div>
              <h3>Local Business</h3>
              <p>Promote your home-based business or discover local services. Support your community's entrepreneurs.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">📢</div>
              <h3>Community Updates</h3>
              <p>Stay informed about local events, announcements, and important community news.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">💬</div>
              <h3>Safe Communication</h3>
              <p>Connect with neighbors through secure messaging. Build trust in your community.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">🏘️</div>
              <h3>Local Focus</h3>
              <p>Everything is organized by your specific community, ensuring relevant connections.</p>
            </div>
            
            <div className="feature-card fade-in">
              <div className="feature-icon">🛡️</div>
              <h3>Trust & Safety</h3>
              <p>Verified users and community moderation ensure a safe environment for everyone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container" style={{ padding: '60px 0' }}>
        <h2 className="text-center mb-4">How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '40px' }}>
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>1️⃣</div>
            <h3>Join Your Community</h3>
            <p>Sign up with your email or phone number and join your local community using a community code or location search.</p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>2️⃣</div>
            <h3>Post & Connect</h3>
            <p>Create posts for help requests, business promotions, or community announcements. Connect with neighbors who can help.</p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>3️⃣</div>
            <h3>Build Relationships</h3>
            <p>Use secure messaging to communicate with neighbors. Build lasting relationships and strengthen your community.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--accent-color), #ff5252)', 
        color: 'white', 
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2>Ready to Connect?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
            Join thousands of communities already using Tangle to build stronger, more connected neighborhoods.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn" style={{ 
              background: 'white', 
              color: 'var(--accent-color)', 
              fontSize: '1.1rem',
              padding: '15px 30px'
            }}>
              Get Started Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 