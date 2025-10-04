import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserManagement';
import './Settings.css';

const Settings = () => {
  const { currentUser, updateProfile } = useContext(UserContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    phone: currentUser?.phone || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    profilePicture: currentUser?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPhone = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +63 917 3348812
    if (digits.startsWith('63')) {
      const formatted = digits.slice(0, 12);
      if (formatted.length <= 2) return `+${formatted}`;
      if (formatted.length <= 5) return `+${formatted.slice(0, 2)} ${formatted.slice(2)}`;
      return `+${formatted.slice(0, 2)} ${formatted.slice(2, 5)} ${formatted.slice(5)}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSave = () => {
    // Updates only fields that should be updated
    const updates = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      profilePicture: formData.profilePicture
    };

    // Only update password if user entered a new one
    if (formData.password) {
      updates.password = formData.password;
    }
    updateProfile(updates);
    setIsEditing(false);
    // Clear password field after save
    setFormData({ ...formData, password: '' });
    // For backend replace updateProfile with API call
  };

  const handleDiscard = () => {
    // Reset form to current user data
    setFormData({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      password: '',
      phone: currentUser?.phone || '',
      dateOfBirth: currentUser?.dateOfBirth || '',
      profilePicture: currentUser?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    });
    setIsEditing(false);
  };

  if (!currentUser) {
    return <div className="settings-container">Please log in to view settings.</div>;
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <span>✏️</span> Edit
          </button>
        )}
      </div>

      <div className="settings-content">
        <div className="settings-left">
          <h3>Overview</h3>
          <div className="profile-section">
            <h4>Profile</h4>
            
            <div className="profile-field">
              <label>Name</label>
              <span>{isEditing ? 'Username' : currentUser.username}</span>
            </div>

            <div className="profile-field">
              <label>UID</label>
              <span>{currentUser.uid || '---'}</span>
              <small className="field-note">Backend will assign UID via API</small>
            </div>

            <div className="profile-field">
              <label>Position</label>
              <span>{currentUser.role}</span>
            </div>

            <div className="profile-field">
              <label>Birth Date</label>
              <span>{currentUser.dateOfBirth || 'Not set'}</span>
            </div>

            <div className="profile-field">
              <label>Email</label>
              <span>{currentUser.email}</span>
            </div>

            <div className="profile-field">
              <label>Phone</label>
              <span>{currentUser.phone || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="settings-right">
          <div className="profile-picture-section">
            <img 
              src={currentUser.profilePicture} 
              alt="Profile" 
              className="profile-picture"
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Profile</h2>
            
            <div className="edit-form">
              <div className="image-upload-section" onDragOver={handleDragOver} onDrop={handleDrop}>
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Preview" className="preview-image" />
                ) : (
                  <div className="upload-placeholder">
                    <p>Drag image here or</p>
                    <label className="browse-btn">
                      Browse Image
                      <input 
                        type="file" 
                        onChange={handleImageChange} 
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}
                {formData.profilePicture && (
                  <label className="change-image-btn">
                    Change Image
                    <input 
                      type="file" 
                      onChange={handleImageChange} 
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your New Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <small>Leave blank to keep current password</small>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your New Phone Number"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                />
              </div>

              <div className="form-group">
                <label>Birth Date</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="discard-btn" onClick={handleDiscard}>
                Discard
              </button>
              <button className="save-btn" onClick={handleSave}>
                Save Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;