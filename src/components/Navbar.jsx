import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => (
  <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
    <div className='container-fluid'>
      <Link className='navbar-brand' to='/'>
        Book Lovers
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-bs-toggle='collapse'
        data-bs-target='#navbarNav'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav'>
          <li className='nav-item'>
            <Link className='nav-link' to='/books'>
              Books
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/add-book'>
              Add Book
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/login'>
              Login
            </Link>
          </li>
          <li className='nav-item ms-auto'>
            <Link className='nav-link navbar-register-btn' to='/register'>
              Register
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
