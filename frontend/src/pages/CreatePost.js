import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'HELP_REQUEST',
    type: 'REQUEST',
    contactInfo: '',
    price: '',
    location: '',
    images: '',
    isUrgent: false,
    isFeatured: false
  });

  const categories = [
    { value: 'HELP_REQUEST', label: 'Help Request', icon: '🆘' },
    { value: 'HELP_OFFER', label: 'Help Offer', icon: '🤝' },
    { value: 'BUY_SELL', label: 'Buy & Sell', icon: '💰' },
    { value: 'BUSINESS', label: 'Business', icon: '🏪' },
    { value: 'SERVICE', label: 'Service', icon: '🔧' },
    { value: 'JOB_GIG', label: 'Job/Gig', icon: '💼' },
    { value: 'EVENT', label: 'Event', icon: '📅' },
    { value: 'ANNOUNCEMENT', label: 'Announcement', icon: '📢' },
    { value: 'LOST_FOUND', label: 'Lost & Found', icon: '🔍' },
    { value: 'VOLUNTEER', label: 'Volunteer', icon: '❤️' }
  ];

  const postTypes = [
    { value: 'REQUEST', label: 'Request (Need Help)' },
    { value: 'OFFER', label: 'Offer (Can Help)' },
    { value: 'ANNOUNCEMENT', label: 'Announcement' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters');
      return false;
    }
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      return false;
    }
    if (formData.price && isNaN(formData.price)) {
      setError('Price must be a valid number');
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
      const postData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      };

              const response = await axios.post('/api/posts', postData);
      
      setSuccess('Post created successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : '📋';
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="auth-header">
          <h2>📝 Create New Post</h2>
          <p>Share something with your {user?.community?.name || 'local'} community</p>
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

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Post Type Selection */}
          <div className="form-group">
            <label className="form-label">What type of post is this?</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {postTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className="btn"
                  style={{
                    background: formData.type === type.value ? 'var(--primary-color)' : 'var(--bg-secondary)',
                    color: formData.type === type.value ? 'white' : 'var(--text-primary)',
                    border: '2px solid var(--border-color)',
                    padding: '10px 20px',
                    fontSize: '14px'
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              disabled={loading}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a clear, descriptive title"
              disabled={loading}
              maxLength={200}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
              {formData.title.length}/200 characters
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about your post..."
              disabled={loading}
              rows={6}
              maxLength={2000}
              style={{ resize: 'vertical' }}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
              {formData.description.length}/2000 characters
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-group">
            <label htmlFor="contactInfo" className="form-label">
              Contact Information
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              className="form-input"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Phone number, email, or preferred contact method"
              disabled={loading}
            />
          </div>

          {/* Price (for Buy/Sell and Business posts) */}
          {(formData.category === 'BUY_SELL' || formData.category === 'BUSINESS' || formData.category === 'SERVICE') && (
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price (₹)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price if applicable"
                disabled={loading}
                min="0"
                step="0.01"
              />
            </div>
          )}

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              placeholder="Specific location or area"
              disabled={loading}
            />
          </div>

          {/* Image URLs */}
          <div className="form-group">
            <label htmlFor="images" className="form-label">
              Image URLs (Optional)
            </label>
            <input
              type="text"
              id="images"
              name="images"
              className="form-input"
              value={formData.images}
              onChange={handleChange}
              placeholder="Enter image URLs separated by commas"
              disabled={loading}
            />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
              Add image URLs separated by commas for multiple images
            </div>
          </div>

          {/* Options */}
          <div className="form-group">
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>⚠️ Mark as Urgent</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>⭐ Mark as Featured</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <span>
                <div className="spinner" style={{ 
                  width: '20px', 
                  height: '20px', 
                  margin: '0 auto',
                  display: 'inline-block'
                }}></div>
                Creating Post...
              </span>
            ) : (
              `Create ${getCategoryIcon(formData.category)} ${formData.category.replace('_', ' ')}`
            )}
          </button>
        </form>

        {/* Tips Section */}
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '20px',
          borderRadius: 'var(--border-radius-sm)',
          marginTop: '30px'
        }}>
          <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>
            💡 Tips for a Great Post
          </h4>
          <ul style={{ 
            color: 'var(--text-secondary)', 
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Be clear and specific in your title and description</li>
            <li>Include relevant contact information</li>
            <li>Add images if they help explain your post</li>
            <li>Use the urgent flag only for time-sensitive matters</li>
            <li>Be respectful and follow community guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 