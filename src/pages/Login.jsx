import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation('login');
  const { login, connectWallet, loginWithEthereum, address } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(t('error.default'));
      }
    }
  };

  const handleEthereumLogin = async () => {
    try {
      await loginWithEthereum();
      navigate('/ethereumProfile');
    } catch (err) {
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setError(t('error.rejected'));
      } else {
        setError(err.message || t('error.ethereum'));
      }
    }
  };

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('heading')}</h1>
      {error && <p className='text-danger'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            {t('form.email')}
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('form.email')}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('form.password')}
            required
          />
        </div>
        <div className='mt-3'>
          <p>
            <Link to='/register' className='text-primary'>
              {t('form.noProfile')}
            </Link>
          </p>
        </div>
        <button type='submit' className='btn btn-primary'>
          {t('form.submit')}
        </button>
      </form>
      <div className='mt-3'>
        <p>{t('or')}</p>
      </div>
      <div>
        {address === '' ? (
          <button
            onClick={connectWallet}
            type='button'
            className='btn btn-primary'
          >
            {t('wallet.connect')}
          </button>
        ) : (
          <button
            onClick={handleEthereumLogin}
            type='button'
            className='btn btn-primary'
          >
            {t('wallet.login')}
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
