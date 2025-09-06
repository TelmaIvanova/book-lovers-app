import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import apiBase from '../config/api';

const Users = () => {
  const { t } = useTranslation('users');
  const [users, setUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      console.error(t('error.noToken'));
      return;
    }

    fetch(`${apiBase}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data.users);
      })
      .catch((error) => console.error(t('error.fetchUsers'), error));
  }, [token, t]);

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1 className='mb-4'>{t('heading')}</h1>

      <div className='mb-3'>
        <Link to='/create-user' className='btn btn-primary'>
          {t('createButton')}
        </Link>
      </div>

      <div className='row'>
        {users.map((user) => (
          <div className='col-md-4 mb-4' key={user._id}>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>
                  {user.firstName} {user.lastName}
                </h5>
                <p className='card-text'>
                  <strong>{t('card.role')}:</strong>{' '}
                  {user.role === 'admin' ? t('roles.admin') : t('roles.reader')}
                </p>
                <Link to={`/users/${user._id}`} className='btn btn-secondary'>
                  {t('card.details')}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
