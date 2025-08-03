import React from 'react';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { value: '', label: 'All Categories', icon: '📋' },
    { value: 'HELP_REQUEST', label: 'Help Request', icon: '🆘' },
    { value: 'HELP_OFFER', label: 'Help Offer', icon: '🤝' },
    { value: 'BUY_SELL', label: 'Buy & Sell', icon: '💰' },
    { value: 'BUSINESS', label: 'Business', icon: '🏪' },
    { value: 'SERVICE', label: 'Services', icon: '🔧' },
    { value: 'JOB_GIG', label: 'Jobs & Gigs', icon: '💼' },
    { value: 'EVENT', label: 'Events', icon: '🎉' },
    { value: 'ANNOUNCEMENT', label: 'Announcements', icon: '📢' },
    { value: 'LOST_FOUND', label: 'Lost & Found', icon: '🔍' },
    { value: 'VOLUNTEER', label: 'Volunteer', icon: '❤️' }
  ];

  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter; 