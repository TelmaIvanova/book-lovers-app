import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EthereumProfile = () => {
  const { token, deleteAccount } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/ethereumUsers/ethereumProfile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user data');

        const data = await res.json();
        setUser(data.data.user);
        setFormData({
          firstName: data.data.user.firstName || '',
          lastName: data.data.user.lastName || '',
          email: data.data.user.email || '',
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
      const res = await fetch('/api/ethereumUsers/ethereumProfile', {
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

  const handleDeleteAccount = async () => {
    setError(null);

    if (
      !window.confirm(
        'Warning!\nThis action is irreversible! Are you sure you want to proceed?'
      )
    )
      return;

    const result = await deleteAccount();

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
      <h1>Ethereum address:</h1>

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
                {user.firstName || '(not set)'}{' '}
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
                {user.lastName || '(not set)'}{' '}
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
                {user.email || '(not set)'}{' '}
                <i
                  className='bi bi-pencil-square'
                  onClick={() => handleEdit('email')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </>
            )}
          </p>

          <div className='mt-3'>
            <h4>Delete Account</h4>
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

export default EthereumProfile;
