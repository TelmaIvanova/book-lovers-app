import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { token, deleteAccount } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user data');

        const data = await res.json();
        setUser(data.data.user);
        setFormData({
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          email: data.data.user.email,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) fetchMe();
  }, [token]);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = async (field) => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: formData[field] }),
      });

      if (!res.ok) throw new Error('Failed to update profile!');

      setUser((prevUser) => ({
        ...prevUser,
        [field]: formData[field],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setEditingField(null);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('/api/users/updateMyPassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      alert('Password updated successfully!');
      setError(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    setError(null);

    if (
      !window.confirm(
        'Warning!\nThis action is irreversible! Are you sure you want to proceed?'
      )
    )
      return;

    const result = await deleteAccount(currentPassword);

    if (result.success) {
      alert('Account deleted successfully.');
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  if (!token) return <p>You must be logged in to view this page.</p>;

  return (
    <div className='container mt-4'>
      <h1>My Profile</h1>

      {error && <p className='text-danger'>{error}</p>}

      {user ? (
        <div className='card p-4'>
          <p>
            <strong>First name:</strong>{' '}
            {editingField === 'firstName' ? (
              <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur('firstName')}
                autoFocus
              />
            ) : (
              <>
                {user.firstName}{' '}
                <i
                  className='bi bi-pencil-square'
                  onClick={() => handleEdit('firstName')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </>
            )}
          </p>
          <p>
            <strong>Last name:</strong>{' '}
            {editingField === 'lastName' ? (
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur('lastName')}
                autoFocus
              />
            ) : (
              <>
                {user.lastName}{' '}
                <i
                  className='bi bi-pencil-square'
                  onClick={() => handleEdit('lastName')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </>
            )}
          </p>
          <p>
            <strong>Email:</strong>{' '}
            {editingField === 'email' ? (
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                autoFocus
              />
            ) : (
              <>
                {user.email}{' '}
                <i
                  className='bi bi-pencil-square'
                  onClick={() => handleEdit('email')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </>
            )}
          </p>

          <div className='mt-3'>
            <h4>Change Password</h4>
            <label>Current Password</label>
            <input
              type='password'
              className='form-control'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <label>New Password</label>
            <input
              type='password'
              className='form-control'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm New Password</label>
            <input
              type='password'
              className='form-control'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={handleChangePassword}
              className='btn btn-primary mt-2'
            >
              Update Password
            </button>
          </div>

          <div className='mt-3'>
            <h4>Delete Account</h4>
            <input
              type='password'
              className='form-control mb-2'
              placeholder='Enter password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button className='btn btn-danger' onClick={handleDeleteAccount}>
              Confirm Delete
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
