import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    locality: '',
    pincode: '',
    communityCode: '',
    userRole: 'RESIDENT'
  });

  const userRoles = [
    { value: 'RESIDENT', label: 'Resident', icon: '🏠' },
    { value: 'BUSINESS_OWNER', label: 'Business Owner', icon: '🏪' },
    { value: 'SERVICE_PROVIDER', label: 'Service Provider', icon: '🔧' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email && !formData.phoneNumber) {
      setError('Email or phone number is required');
      return false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.communityCode.trim()) {
      setError('Community code is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-header">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '20px' 
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginRight: '16px',
              boxShadow: 'var(--shadow)'
            }}>
              🧱
            </div>
            <h2 style={{ 
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              Join Tangle
            </h2>
          </div>
          <p>Create your account and connect with your community</p>
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {success && (
          <div className="message success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          {/* Email and Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="form-input"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit number"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          </div>

          {/* Address Fields */}
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your complete address"
              disabled={loading}
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="locality" className="form-label">
                Locality
              </label>
              <input
                type="text"
                id="locality"
                name="locality"
                className="form-input"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Your locality/area"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pincode" className="form-label">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                className="form-input"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                disabled={loading}
              />
            </div>
          </div>

          {/* Community Code */}
          <div className="form-group">
            <label htmlFor="communityCode" className="form-label">
              Community Code *
            </label>
            <input
              type="text"
              id="communityCode"
              name="communityCode"
              className="form-input"
              value={formData.communityCode}
              onChange={handleChange}
              placeholder="Enter your community code"
              disabled={loading}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Available codes: ANNA001, TNAGAR001, ADYAR001, MYLAPORE001, VELACHERY001
            </div>
          </div>

          {/* User Role */}
          <div className="form-group">
            <label className="form-label">I am a:</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {userRoles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userRole: role.value }))}
                  className="btn"
                  style={{
                    background: formData.userRole === role.value 
                      ? 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' 
                      : 'var(--bg-secondary)',
                    color: formData.userRole === role.value ? 'white' : 'var(--text-primary)',
                    border: '2px solid var(--border-color)',
                    padding: '12px 20px',
                    fontSize: '14px',
                    flex: '1',
                    minWidth: '120px'
                  }}
                >
                  {role.icon} {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? (
              <span>
                <div className="spinner" style={{ 
                  width: '20px', 
                  height: '20px', 
                  margin: '0 auto',
                  display: 'inline-block'
                }}></div>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Already have an account?
          </p>
          <Link to="/login" className="btn btn-secondary">
            Sign In Instead
          </Link>
        </div>

        {/* Demo Account Info */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          padding: '20px',
          borderRadius: 'var(--border-radius-sm)',
          marginTop: '32px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <h4 style={{ marginBottom: '12px', color: 'var(--primary-color)' }}>
            🚀 Quick Demo
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Use these demo credentials to test the app:
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Email:</strong> john@example.com<br />
            <strong>Password:</strong> abcd<br />
            <strong>Phone:</strong> 9876543211
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 