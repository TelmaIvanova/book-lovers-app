import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => (
  <div>
    <h1>Register</h1>
    <form>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Name
        </label>
        <input type='text' className='form-control' id='name' required />
      </div>
      <div className='mb-3'>
        <label htmlFor='email' className='form-label'>
          Email
        </label>
        <input type='email' className='form-control' id='email' required />
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label'>
          Password
        </label>
        <input
          type='password'
          className='form-control'
          id='password'
          required
        />
      </div>
      <div className='col-md-3'>
        <p>
          <Link to='/login' className='text-primary'>
            Already have profile? Login here!
          </Link>
        </p>
      </div>
      <button type='submit' className='btn btn-primary'>
        Register
      </button>
    </form>
  </div>
);

export default Register;
