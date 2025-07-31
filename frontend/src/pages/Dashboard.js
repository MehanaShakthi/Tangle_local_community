import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stats, setStats] = useState({
    totalPosts: 0,
    myPosts: 0,
    urgentPosts: 0,
    communityMembers: 0
  });

  const categories = [
    { value: 'ALL', label: 'All Posts', icon: '📋' },
    { value: 'HELP_REQUEST', label: 'Help Requests', icon: '🆘' },
    { value: 'HELP_OFFER', label: 'Help Offers', icon: '🤝' },
    { value: 'BUY_SELL', label: 'Buy & Sell', icon: '💰' },
    { value: 'BUSINESS', label: 'Business', icon: '🏪' },
    { value: 'SERVICE', label: 'Services', icon: '🔧' },
    { value: 'EVENT', label: 'Events', icon: '📅' },
    { value: 'ANNOUNCEMENT', label: 'Announcements', icon: '📢' }
  ];

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts', {
        params: {
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          page: 0,
          size: 20
        }
      });
      setPosts(response.data.content || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/posts/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : '📋';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Welcome Section */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '10px' }}>
          Welcome back, {user?.fullName}! 👋
        </h1>
        <p style={{ opacity: 0.9 }}>
          Stay connected with your {user?.community?.name || 'local'} community
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <Link to="/create-post" className="btn btn-accent">
          ➕ Create New Post
        </Link>
        <Link to="/profile" className="btn btn-secondary">
          👤 My Profile
        </Link>
        <button className="btn btn-secondary">
          🔍 Search Posts
        </button>
      </div>

      {/* Statistics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalPosts}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.myPosts}</div>
          <div className="stat-label">My Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.urgentPosts}</div>
          <div className="stat-label">Urgent Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.communityMembers}</div>
          <div className="stat-label">Community Members</div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Filter by Category</h3>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          flexWrap: 'wrap',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className="btn"
              style={{
                background: selectedCategory === category.value 
                  ? 'var(--primary-color)' 
                  : 'var(--bg-secondary)',
                color: selectedCategory === category.value ? 'white' : 'var(--text-primary)',
                border: '2px solid var(--border-color)',
                padding: '8px 16px',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Section */}
      <div className="dashboard-header">
        <h2>Community Posts</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {posts.length} posts found
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📭</div>
          <h3 style={{ marginBottom: '10px' }}>No posts yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {selectedCategory === 'ALL' 
              ? 'Be the first to create a post in your community!'
              : `No ${categories.find(cat => cat.value === selectedCategory)?.label.toLowerCase()} found.`
            }
          </p>
          <Link to="/create-post" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
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
                  {post.description.length > 150 
                    ? `${post.description.substring(0, 150)}...` 
                    : post.description
                  }
                </p>
                <div className="post-meta">
                  <span>👤 {post.user?.fullName}</span>
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
                <Link 
                  to={`/post/${post.id}`}
                  className="btn btn-primary"
                  style={{ 
                    marginTop: '15px',
                    display: 'inline-block',
                    fontSize: '14px',
                    padding: '8px 16px'
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 