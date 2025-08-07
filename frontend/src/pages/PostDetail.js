import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
              const response = await axios.get(`/api/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Post not found or you may not have permission to view it');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
              const response = await axios.get(`/api/posts/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
              const response = await axios.post(`/api/posts/${id}/comments`, {
        content: commentText
      });
      setComments(prev => [response.data, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReport = async () => {
    if (!window.confirm('Are you sure you want to report this post?')) return;

    try {
              await axios.post(`/api/posts/${id}/report`, {
        reason: 'Inappropriate content',
        type: 'INAPPROPRIATE_CONTENT'
      });
      alert('Post reported successfully');
    } catch (error) {
      console.error('Error reporting post:', error);
      setError('Failed to report post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="container">
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❌</div>
          <h3 style={{ marginBottom: '10px' }}>Post Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {error}
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="container">
      {/* Post Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <div>
            <h1 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <span className="post-category">
                {getCategoryIcon(post.category)} {post.category.replace('_', ' ')}
              </span>
              {post.isUrgent && (
                <span style={{
                  background: 'var(--warning-color)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  ⚠️ Urgent
                </span>
              )}
              {post.isFeatured && (
                <span style={{
                  background: 'var(--accent-color)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {formatDate(post.createdAt)}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              👁️ {post.viewCount || 0} views
            </div>
          </div>
        </div>

        {/* Post Meta */}
        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '15px', 
          borderRadius: 'var(--border-radius-sm)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <strong>👤 {post.user?.fullName}</strong>
              {post.user?.isVerified && (
                <span style={{ color: 'var(--success-color)', marginLeft: '5px' }}>✓</span>
              )}
            </div>
            {post.location && (
              <div>📍 {post.location}</div>
            )}
            {post.price && (
              <div style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>
                ₹{post.price}
              </div>
            )}
          </div>
        </div>

        {/* Post Description */}
        <div style={{ lineHeight: '1.6', marginBottom: '20px' }}>
          {post.description.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '10px' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Images */}
        {post.images && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
              {post.images.split(',').map((image, index) => (
                <img
                  key={index}
                  src={image.trim()}
                  alt={`Post image ${index + 1}`}
                  style={{
                    width: '200px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '2px solid var(--border-color)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        {post.contactInfo && (
          <div style={{ 
            background: 'var(--primary-color)', 
            color: 'white', 
            padding: '15px', 
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '20px'
          }}>
            <h4 style={{ marginBottom: '10px' }}>📞 Contact Information</h4>
            <p>{post.contactInfo}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Hi! I saw your post: ${post.title}`)}`, '_blank')}
            className="btn btn-accent"
          >
            💬 Contact on WhatsApp
          </button>
          <button
            onClick={() => window.open(`tel:${post.contactInfo?.replace(/\D/g, '')}`, '_blank')}
            className="btn btn-secondary"
          >
            📞 Call
          </button>
          <button
            onClick={handleReport}
            className="btn"
            style={{ background: 'var(--error-color)', color: 'white' }}
          >
            🚨 Report
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>💬 Comments ({comments.length})</h3>

        {/* Add Comment */}
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label htmlFor="comment" className="form-label">
              Add a comment
            </label>
            <textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="form-input"
              placeholder="Share your thoughts..."
              rows={3}
              disabled={submittingComment}
              maxLength={500}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
              {commentText.length}/500 characters
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!commentText.trim() || submittingComment}
          >
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💬</div>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: '15px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'var(--bg-secondary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <strong>{comment.user?.fullName}</strong>
                    {comment.user?.isVerified && (
                      <span style={{ color: 'var(--success-color)', marginLeft: '5px' }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
                <p style={{ lineHeight: '1.5', margin: 0 }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PostDetail; 