import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import apiBase from '../config/api';

const CreateUser = () => {
  const { t } = useTranslation('createUser');
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'reader',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const requestData = { ...formData, passwordConfirm: formData.password };

    try {
      const res = await fetch(`${apiBase}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      if (res.status === 201) {
        setSuccessMessage(t('success'));
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          passwordConfirm: '',
          role: 'reader',
        });
      } else {
        throw new Error(data.message || t('error.failed'));
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('heading')}</h1>
      {successMessage && <p className='text-success'>{successMessage}</p>}
      {errorMessage && <p className='text-danger'>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='firstName' className='form-label'>
            {t('form.firstName')}
          </label>
          <input
            type='text'
            className='form-control'
            id='firstName'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='lastName' className='form-label'>
            {t('form.lastName')}
          </label>
          <input
            type='text'
            className='form-control'
            id='lastName'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            {t('form.email')}
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='password' className='form-label'>
            {t('form.password')}
          </label>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='role' className='form-label'>
            {t('form.role')}
          </label>
          <select
            className='form-select'
            id='role'
            name='role'
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value='reader'>{t('form.roleOptions.reader')}</option>
            <option value='admin'>{t('form.roleOptions.admin')}</option>
          </select>
        </div>
        <button type='submit' className='btn btn-primary'>
          {t('form.submit')}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
