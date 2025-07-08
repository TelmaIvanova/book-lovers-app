import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Login = () => {
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
        setError('Incorrect email/password!');
      }
    }
  };

  const handleEthereumLogin = async () => {
    try {
      await loginWithEthereum();
      navigate('/ethereumProfile');
    } catch (err) {
      setError(err.message || 'Ethereum login failed');
    }
  };

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>Login ‧ Book Lovers</title>
      </Helmet>
      <h1>Login</h1>
      {error && <p className='text-danger'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            Email
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            type='password'
            className='form-control'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        </div>
        <div className='mt-3'>
          <p>
            <Link to='/register' className='text-primary'>
              No profile? Register now!
            </Link>
          </p>
        </div>
        <button type='submit' className='btn btn-primary'>
          Login
        </button>
      </form>
      <div className='mt-3'>
        <p>or</p>
      </div>
      <div>
        {address === '' ? (
          <>
            <button
              onClick={connectWallet}
              type='button'
              className='btn btn-primary'
            >
              Connect wallet
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEthereumLogin}
              type='button'
              className='btn btn-primary'
            >
              Login with Ethereum
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
