import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import apiBase from '../config/api';

const UserDetails = () => {
  const { t } = useTranslation('userDetails');
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
      console.error(t('error.noToken'));
      return;
    }

    fetch(`${apiBase}/users/${id}`, {
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
          setError(t('error.notFound'));
        }
      })
      .catch((error) => {
        console.error(t('error.fetch'), error);
        setError(t('error.fetch'));
      });
  }, [id, token, currentUser?.role, t]);

  const handleBlur = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));

    fetch(`${apiBase}/users/profile`, {
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
        alert(t('success.update', { field }));
      })
      .catch(() => alert(t('error.update')));
  };

  const handleDelete = () => {
    const confirmation = window.confirm(t('confirm.delete'));
    if (confirmation) {
      fetch(`${apiBase}/users/delete/${id}`, {
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
            throw new Error(t('error.delete'));
          }
        })
        .catch((error) => console.error(t('error.delete'), error));
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordBlur = () => {
    console.log(t('log.sendingRequest'), {
      token,
      role: currentUser?.role,
      id: currentUser?.id,
    });

    fetch(`${apiBase}/users/changePassword/${id}`, {
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
          alert(t('success.password'));
        } else {
          alert(t('error.password'));
        }
      })
      .catch((error) => {
        console.error(t('error.password'), error);
        alert(t('error.password'));
      });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>
          {t('title')} {editedUser.firstName} {editedUser.lastName}
        </title>
      </Helmet>
      <h1>{t('heading')}</h1>
      <div className='card p-4'>
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
              placeholder={t('fields.firstName')}
            />
            <input
              type='text'
              value={editedUser.lastName}
              onChange={(e) =>
                setEditedUser({ ...editedUser, lastName: e.target.value })
              }
              onBlur={(e) => handleBlur('lastName', e.target.value)}
              className='form-control mb-2'
              placeholder={t('fields.lastName')}
            />
          </h5>
          <p className='card-text'>
            <strong>{t('fields.email')}:</strong>
            <input
              type='email'
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
              onBlur={(e) => handleBlur('email', e.target.value)}
              className='form-control mb-2'
              placeholder={t('fields.email')}
            />
          </p>
          <p className='card-text'>
            <strong>{t('fields.role')}:</strong>{' '}
            {user.role === 'admin'
              ? t('fields.roleOptions.admin')
              : t('fields.roleOptions.reader')}
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
            <option value='reader'>{t('fields.roleOptions.reader')}</option>
            <option value='admin'>{t('fields.roleOptions.admin')}</option>
          </select>

          <p className='card-text'>
            <strong>{t('fields.newPassword')}:</strong>
            <input
              type='password'
              value={newPassword}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              className='form-control mb-2'
              placeholder={t('fields.newPassword')}
            />
          </p>
          <button className='btn btn-danger' onClick={handleDelete}>
            {t('buttons.delete')}
          </button>
          <br />
          <button
            className='btn btn-secondary'
            onClick={() => navigate('/users')}
          >
            {t('buttons.back')}
          </button>
        </div>
      </div>
      <br />
    </div>
  );
};

export default UserDetails;
