import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      HELP_REQUEST: '#ff6b6b',
      HELP_OFFER: '#4ecdc4',
      BUY_SELL: '#45b7d1',
      BUSINESS: '#96ceb4',
      SERVICE: '#feca57',
      JOB_GIG: '#ff9ff3',
      EVENT: '#54a0ff',
      ANNOUNCEMENT: '#5f27cd',
      LOST_FOUND: '#ff6348',
      VOLUNTEER: '#2ed573'
    };
    return colors[category] || '#6c5ce7';
  };

  const getTypeIcon = (type) => {
    const icons = {
      REQUEST: '🆘',
      OFFER: '🤝',
      ANNOUNCEMENT: '📢'
    };
    return icons[type] || '📝';
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-meta">
          <div className="post-author">
            <div className="author-avatar">
              {post.user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="author-info">
              <h4>{post.user?.fullName || 'Anonymous'}</h4>
              <span className="post-time">{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <div className="post-badges">
            {post.isUrgent && <span className="badge urgent">🚨 Urgent</span>}
            {post.isFeatured && <span className="badge featured">⭐ Featured</span>}
            <span 
              className="badge category"
              style={{ backgroundColor: getCategoryColor(post.category) }}
            >
              {getTypeIcon(post.type)} {post.category.replace('_', ' ')}
            </span>
          </div>
        </div>
        {user && (user.id === post.user?.id || user.role === 'ADMIN') && (
          <div className="post-actions">
            <button 
              className="btn-icon delete-btn"
              onClick={() => onDelete(post.id)}
              title="Delete post"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">{post.description}</p>
        
        {post.images && post.images.length > 0 && (
          <div className="post-images">
            {post.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Post image ${index + 1}`}
                className="post-image"
              />
            ))}
          </div>
        )}

        {post.price && (
          <div className="post-price">
            <span className="price-label">Price:</span>
            <span className="price-value">₹{post.price}</span>
          </div>
        )}

        {post.location && (
          <div className="post-location">
            📍 {post.location}
          </div>
        )}

        {post.contactInfo && (
          <div className="post-contact">
            <span className="contact-label">Contact:</span>
            <span className="contact-info">{post.contactInfo}</span>
          </div>
        )}
      </div>

      <div className="post-footer">
        <div className="post-stats">
          <span className="stat">
            👁️ {post.viewCount || 0} views
          </span>
          <span className="stat">
            💬 {post.comments?.length || 0} comments
          </span>
        </div>
        
        <div className="post-actions-footer">
          <Link to={`/post/${post.id}`} className="btn btn-primary">
            View Details
          </Link>
          {post.contactInfo && (
            <a 
              href={`https://wa.me/${post.contactInfo.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success"
            >
              📱 WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard; 