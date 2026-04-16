/**
 * CreateOffer.js — Form for restaurant owners to post food offers.
 *
 * From your create-offer.html: dish name, cuisine, dietary info, quantity, pickup time.
 * Added: image upload, price, tag selection.
 *
 * Uses FormData for the API call because we're uploading a file (the food image).
 * Regular JSON can't carry binary file data — FormData encodes it as multipart/form-data.
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { createProduct } from '../api/api';

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 20px',
    minHeight: 'calc(100vh - 64px)',
  },
  card: {
    background: '#fffdf8',
    border: '1px solid #ddd2bf',
    borderRadius: 18,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 560,
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    animation: 'fadeIn 0.4s ease-out',
  },
  heading: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 24,
    fontWeight: 700,
    color: '#1f5c3f',
    marginBottom: 6,
  },
  subtitle: {
    color: '#555',
    fontSize: 14,
    marginBottom: 28,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #c8bea9',
    borderRadius: 10,
    background: '#fffdf8',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 16,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #c8bea9',
    borderRadius: 10,
    background: '#fffdf8',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 16,
    outline: 'none',
    resize: 'vertical',
    minHeight: 80,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  imageUpload: {
    border: '2px dashed #c8bea9',
    borderRadius: 14,
    padding: '24px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: 16,
    transition: 'all 0.2s',
    background: '#faf6ee',
  },
  imagePreview: {
    width: '100%',
    maxHeight: 200,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: 16,
  },
  btn: {
    width: '100%',
    padding: '13px',
    borderRadius: 10,
    border: 'none',
    background: '#1f5c3f',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s',
    marginTop: 8,
  },
  tip: {
    background: '#e8f5e9',
    border: '1px solid #c8e6c9',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 13,
    color: '#2e7d32',
    marginTop: 20,
    lineHeight: 1.5,
  },
  success: {
    background: '#e8f5e9',
    border: '1px solid #4ade80',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#166534',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
};

function CreateOffer() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dietaryInfo, setDietaryInfo] = useState('');
  const [image, setImage] = useState(null);          // File object
  const [imagePreview, setImagePreview] = useState(null); // Base64 preview URL
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle image file selection.
   * FileReader.readAsDataURL() converts the file to a base64 string
   * for the preview image. The actual File object goes in FormData.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Build FormData (required for file uploads)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', parseFloat(price) || 0);
      formData.append('quantity', parseInt(quantity) || 1);
      formData.append('pickup_time', pickupTime);
      formData.append('dietary_info', dietaryInfo);
      formData.append('category', 'Pickup');  // Only pickup
      if (image) {
        formData.append('image', image);      // The actual file binary
      }

      await createProduct(formData);
      setSuccess(true);
      // Reset form
      setName(''); setDescription(''); setPrice('');
      setQuantity(''); setPickupTime(''); setDietaryInfo('');
      setImage(null); setImagePreview(null);
      // Navigate to dashboard after 1.5 seconds
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to create offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Shared input focus handlers
  const focus = (e) => {
    e.target.style.borderColor = '#1f5c3f';
    e.target.style.boxShadow = '0 0 0 3px rgba(31,92,63,0.1)';
  };
  const blur = (e) => {
    e.target.style.borderColor = '#c8bea9';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Food Offer</h2>
        <p style={styles.subtitle}>Post a new dish for local pickup.</p>

        {success && <div style={styles.success}>Offer created successfully! Redirecting...</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* Image upload area */}
        <label style={styles.label}>Food Photo</label>
        {imagePreview ? (
          <div>
            <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
            <button
              onClick={() => { setImage(null); setImagePreview(null); }}
              style={{ ...styles.btn, background: '#ef4444', marginBottom: 16, padding: 8, fontSize: 13 }}
            >
              Remove Photo
            </button>
          </div>
        ) : (
          <label
            style={styles.imageUpload}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1f5c3f';
              e.currentTarget.style.background = '#e8f5e9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#c8bea9';
              e.currentTarget.style.background = '#faf6ee';
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
              Click to upload food photo
            </div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
              JPG, PNG (max 5MB)
            </div>
            {/* Hidden file input — label click triggers it */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>
        )}

        <label style={styles.label}>Dish Name</label>
        <input style={styles.input} type="text" placeholder="e.g. Chicken Tikka"
          value={name} onChange={(e) => setName(e.target.value)}
          onFocus={focus} onBlur={blur} />

        <label style={styles.label}>Description</label>
        <textarea style={styles.textarea} placeholder="Describe your dish..."
          value={description} onChange={(e) => setDescription(e.target.value)}
          onFocus={focus} onBlur={blur} />

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Price ($)</label>
            <input style={styles.input} type="number" step="0.01" placeholder="12.99"
              value={price} onChange={(e) => setPrice(e.target.value)}
              onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={styles.label}>Quantity</label>
            <input style={styles.input} type="number" placeholder="5"
              value={quantity} onChange={(e) => setQuantity(e.target.value)}
              onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <div style={styles.row}>
          <div>
            <label style={styles.label}>Pickup Time</label>
            <input style={styles.input} type="text" placeholder="6:00 PM"
              value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}
              onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={styles.label}>Dietary Info</label>
            <input style={styles.input} type="text" placeholder="Halal, Vegan, etc."
              value={dietaryInfo} onChange={(e) => setDietaryInfo(e.target.value)}
              onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
          onMouseEnter={(e) => e.target.style.background = '#2d7a53'}
          onMouseLeave={(e) => e.target.style.background = '#1f5c3f'}
        >
          {loading ? 'Posting...' : 'Post Offer'}
        </button>

        <div style={styles.tip}>
          💡 <strong>Tip:</strong> Include a clear photo, accurate pickup time, and dietary 
          information to get more orders.
        </div>
      </div>
    </div>
  );
}

export default CreateOffer;
