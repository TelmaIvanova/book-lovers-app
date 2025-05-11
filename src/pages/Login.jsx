import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login, loginWithEthereum } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Incorrect email/password!');
      }
    }
  };

  const handleEthereumLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await loginWithEthereum();
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('MetaMask extension is not installed.');
      }
    }
  };

  return (
    <div className='container mt-4'>
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
      <button
        onClick={handleEthereumLogin}
        type='button'
        className='btn btn-primary'
      >
        Login with Ethereum
      </button>
    </div>
  );
};

export default Login;
