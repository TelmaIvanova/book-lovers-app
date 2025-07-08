import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const EthereumProfile = () => {
  const { t } = useTranslation('ethereumProfile');
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

        if (!res.ok) throw new Error(t('error.fetch'));

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
  }, [token, t]);

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

  const handleDeleteAccount = async () => {
    setError(null);

    if (!window.confirm(t('delete.confirmMessage'))) return;

    const result = await deleteAccount();

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
            <strong>Ethereum {t('fields.address')}:</strong>{' '}
            {user.ethereumAddress}
          </p>
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
                {user.firstName || t('fields.notSet')}{' '}
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
                {user.lastName || t('fields.notSet')}{' '}
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
                {user.email || t('fields.notSet')}{' '}
                <i
                  className='bi bi-pencil-square'
                  onClick={() => handleEdit('email')}
                  style={{ cursor: 'pointer' }}
                ></i>
              </>
            )}
          </p>

          <div className='mt-3'>
            <h4>{t('delete.section')}</h4>
            <button className='btn btn-danger' onClick={handleDeleteAccount}>
              {t('delete.button')}
            </button>
          </div>
        </div>
      ) : (
        <p>{t('loading')}</p>
      )}
    </div>
  );
};

export default EthereumProfile;
