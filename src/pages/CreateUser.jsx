import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CreateUser = () => {
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
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();
      if (res.status === 201) {
        setSuccessMessage('User created successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          passwordConfirm: '',
          role: 'reader',
        });
      } else {
        throw new Error(data.message || 'Failed to create user');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='container mt-4'>
      <h1>Create User</h1>
      {successMessage && <p className='text-success'>{successMessage}</p>}
      {errorMessage && <p className='text-danger'>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='firstName' className='form-label'>
            First Name
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
            Last Name
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
            Email
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
            Password
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
            Role
          </label>
          <select
            className='form-select'
            id='role'
            name='role'
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value='reader'>Reader</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <button type='submit' className='btn btn-primary'>
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
