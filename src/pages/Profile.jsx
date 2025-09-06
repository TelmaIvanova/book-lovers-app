import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import apiBase from '../config/api';

const Profile = () => {
  const { t } = useTranslation('profile');
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
        const res = await fetch(`${apiBase}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(t('error.fetch'));

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
  }, [token, t]);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = async (field) => {
    try {
      const res = await fetch(`${apiBase}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: formData[field] }),
      });

      if (!res.ok) throw new Error(t('error.update'));

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
      setError(t('error.passwordMismatch'));
      return;
    }

    try {
      const response = await fetch(`${apiBase}/users/updatePassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('error.changePassword'));
      }

      alert(t('password.success'));
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

    if (!window.confirm(t('delete.confirmMessage'))) return;

    const result = await deleteAccount(currentPassword);

    if (result.success) {
      alert(t('delete.success'));
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  if (!token) return <p>{t('authRequired')}</p>;

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('heading')}</h1>

      {error && <p className='text-danger'>{error}</p>}

      {user ? (
        <div className='card p-4'>
          <p>
            <strong>{t('fields.firstName')}:</strong>{' '}
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
            <strong>{t('fields.lastName')}:</strong>{' '}
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
            <strong>{t('fields.email')}:</strong>{' '}
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
            <h4>{t('password.section')}</h4>
            <label>{t('password.current')}</label>
            <input
              type='password'
              className='form-control'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <label>{t('password.new')}</label>
            <input
              type='password'
              className='form-control'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>{t('password.confirm')}</label>
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
              {t('password.updateButton')}
            </button>
          </div>

          <div className='mt-3'>
            <h4>{t('delete.section')}</h4>
            <input
              type='password'
              className='form-control mb-2'
              placeholder={t('delete.placeholder')}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button className='btn btn-danger' onClick={handleDeleteAccount}>
              {t('delete.button')}
            </button>
          </div>
        </div>
      ) : (
        <p>{t('loading')}</p>
      )}
      <br />
    </div>
  );
};

export default Profile;
