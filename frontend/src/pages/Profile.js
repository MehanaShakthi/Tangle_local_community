import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0
  });

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    address: user?.address || '',
    locality: user?.locality || '',
    pincode: user?.pincode || '',
    profilePicture: user?.profilePicture || ''
  });

  useEffect(() => {
    fetchMyPosts();
    fetchStats();
  }, []);

  const fetchMyPosts = async () => {
    try {
              const response = await axios.get('/api/posts/my-posts');
      setMyPosts(response.data);
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
  };

  const fetchStats = async () => {
    try {
              const response = await axios.get('/api/auth/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'HELP_REQUEST': '🆘',
      'HELP_OFFER': '🤝',
      'BUY_SELL': '💰',
      'BUSINESS': '🏪',
      'SERVICE': '🔧',
      'JOB_GIG': '💼',
      'EVENT': '📅',
      'ANNOUNCEMENT': '📢',
      'LOST_FOUND': '🔍',
      'VOLUNTEER': '❤️'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="container">
      {/* Profile Header */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
        color: 'white',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            marginRight: '20px'
          }}>
            {user?.profilePicture ? '🖼️' : '👤'}
          </div>
          <div>
            <h1 style={{ marginBottom: '5px' }}>{user?.fullName}</h1>
            <p style={{ opacity: 0.9, marginBottom: '5px' }}>
              {user?.email || user?.phoneNumber}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ 
                background: 'rgba(255, 255, 255, 0.2)', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                {user?.role?.replace('_', ' ')}
              </span>
              {user?.isVerified && (
                <span style={{ color: 'var(--success-color)' }}>✓ Verified</span>
              )}
            </div>
          </div>
        </div>

        {user?.community && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '15px', 
            borderRadius: 'var(--border-radius-sm)',
            marginTop: '20px'
          }}>
            <h4 style={{ marginBottom: '5px' }}>🏘️ Community</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>
              {user.community.name} - {user.community.location}
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPosts}</div>
          <div className="stat-label">My Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalViews}</div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalComments}</div>
          <div className="stat-label">Comments Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{myPosts.length}</div>
          <div className="stat-label">Active Posts</div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>👤 Profile Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-secondary"
            style={{ padding: '8px 16px' }}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--error-color)',
            color: 'white',
            padding: '12px',
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'var(--success-color)',
            color: 'white',
            padding: '12px',
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                id="address"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="locality" className="form-label">Locality</label>
              <input
                type="text"
                id="locality"
                name="locality"
                className="form-input"
                value={formData.locality}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pincode" className="form-label">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                className="form-input"
                value={formData.pincode}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profilePicture" className="form-label">Profile Picture URL</label>
              <input
                type="url"
                id="profilePicture"
                name="profilePicture"
                className="form-input"
                value={formData.profilePicture}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <strong>📧 Email:</strong>
              <p>{user?.email || 'Not provided'}</p>
            </div>
            <div>
              <strong>📱 Phone:</strong>
              <p>{user?.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <strong>🏠 Address:</strong>
              <p>{user?.address || 'Not provided'}</p>
            </div>
            <div>
              <strong>📍 Locality:</strong>
              <p>{user?.locality || 'Not provided'}</p>
            </div>
            <div>
              <strong>📮 Pincode:</strong>
              <p>{user?.pincode || 'Not provided'}</p>
            </div>
            <div>
              <strong>👤 Role:</strong>
              <p>{user?.role?.replace('_', ' ')}</p>
            </div>
            <div>
              <strong>📅 Member Since:</strong>
              <p>{formatDate(user?.createdAt)}</p>
            </div>
            <div>
              <strong>✅ Status:</strong>
              <p>{user?.isVerified ? 'Verified' : 'Not Verified'}</p>
            </div>
          </div>
        )}
      </div>

      {/* My Posts */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>📝 My Posts ({myPosts.length})</h3>

        {myPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
            <p>You haven't created any posts yet.</p>
            <button
              onClick={() => window.location.href = '/create-post'}
              className="btn btn-primary"
              style={{ marginTop: '15px' }}
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="posts-grid">
            {myPosts.map((post) => (
              <div key={post.id} className="post-card">
                {post.images && (
                  <img 
                    src={post.images.split(',')[0]} 
                    alt={post.title}
                    className="post-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="post-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 className="post-title">{post.title}</h3>
                    <span className="post-category">
                      {getCategoryIcon(post.category)} {post.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="post-description">
                    {post.description.length > 100 
                      ? `${post.description.substring(0, 100)}...` 
                      : post.description
                    }
                  </p>
                  <div className="post-meta">
                    <span>👁️ {post.viewCount || 0} views</span>
                    <span>📅 {formatDate(post.createdAt)}</span>
                  </div>
                  {post.isUrgent && (
                    <div style={{
                      background: 'var(--warning-color)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      marginTop: '10px',
                      display: 'inline-block'
                    }}>
                      ⚠️ Urgent
                    </div>
                  )}
                  <button 
                    onClick={() => window.location.href = `/post/${post.id}`}
                    className="btn btn-primary"
                    style={{ 
                      marginTop: '15px',
                      fontSize: '14px',
                      padding: '8px 16px'
                    }}
                  >
                    View Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 