import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const { token, user: currentUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.error('No token available');
      return;
    }

    fetch(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Role': currentUser?.role,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setUser(data.data.user);
          setEditedUser({
            firstName: data.data.user.firstName || '',
            lastName: data.data.user.lastName || '',
            email: data.data.user.email || '',
            role: data.data.user.role || '',
          });
        } else {
          setError('User not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details');
      });
  }, [id, token, currentUser?.role]);

  const handleBlur = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));

    fetch(`/api/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, [field]: value }),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        setUser((prevUser) => ({
          ...prevUser,
          [field]: updatedData.data.user[field],
        }));
        alert(`${field} updated successfully!`);
      })
      .catch((error) => alert(`Failed to update ${field}.`));
  };

  const handleDelete = () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this user?'
    );
    if (confirmation) {
      fetch(`/api/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Role': currentUser?.role,
        },
      })
        .then((response) => {
          if (response.ok) {
            navigate('/users');
          } else {
            throw new Error('Failed to delete user');
          }
        })
        .catch((error) => console.error('Error deleting user:', error));
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordBlur = () => {
    console.log('Sending request with:', {
      token,
      role: currentUser?.role,
      id: currentUser?.id,
    });

    fetch(`/api/users/changePassword/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Role': currentUser?.role,
      },
      body: JSON.stringify({
        newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          alert('Password updated successfully');
        } else {
          alert('Failed to update password');
        }
      })
      .catch((error) => {
        console.error('Error updating password:', error);
        alert('Failed to update password');
      });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mt-4'>
      <h1>User Details</h1>
      <div className='card'>
        <div className='card-body'>
          <h5 className='card-title'>
            <input
              type='text'
              value={editedUser.firstName}
              onChange={(e) =>
                setEditedUser({ ...editedUser, firstName: e.target.value })
              }
              onBlur={(e) => handleBlur('firstName', e.target.value)}
              className='form-control mb-2'
            />
            <input
              type='text'
              value={editedUser.lastName}
              onChange={(e) =>
                setEditedUser({ ...editedUser, lastName: e.target.value })
              }
              onBlur={(e) => handleBlur('lastName', e.target.value)}
              className='form-control mb-2'
            />
          </h5>
          <p className='card-text'>
            <strong>Email:</strong>
            <input
              type='email'
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
              onBlur={(e) => handleBlur('email', e.target.value)}
              className='form-control mb-2'
            />
          </p>
          <p className='card-text'>
            <strong>Role:</strong> {user.role}
          </p>
          <select
            className='form-select'
            id='role'
            name='role'
            value={editedUser.role}
            onChange={(e) => {
              setEditedUser({ ...editedUser, role: e.target.value });
              handleBlur('role', e.target.value);
            }}
          >
            <option value='reader'>Reader</option>
            <option value='admin'>Admin</option>
          </select>

          <p className='card-text'>
            <strong>New Password:</strong>
            <input
              type='password'
              value={newPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              className='form-control mb-2'
            />
          </p>
          <button className='btn btn-danger' onClick={handleDelete}>
            Delete User
          </button>
          <button
            className='btn btn-secondary'
            onClick={() => navigate('/users')}
          >
            Back to Users List
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
