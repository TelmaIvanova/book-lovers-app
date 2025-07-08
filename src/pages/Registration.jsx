import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const Register = () => {
  const { t } = useTranslation('register');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
    navigate('/');
  };

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('heading')}</h1>
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
          <label htmlFor='passwordConfirm' className='form-label'>
            {t('form.passwordConfirm')}
          </label>
          <input
            type='password'
            className='form-control'
            id='passwordConfirm'
            name='passwordConfirm'
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-3'>
          <p>
            <Link to='/login' className='text-primary'>
              {t('alreadyHaveProfile')}
            </Link>
          </p>
        </div>
        <button type='submit' className='btn btn-primary'>
          {t('form.submit')}
        </button>
        <br/>
      </form>
    </div>
  );
};

export default Register;
