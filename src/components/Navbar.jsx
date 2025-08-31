import React, { useState } from 'react';
import DarkModeToggle from '../components/DarkModeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import CartIcon from './CartIcon';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('navbar');
  const [language, setLanguage] = useState(i18n.language || 'en');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <div className='container-fluid'>
        <Link className='navbar-brand d-flex align-items-center' to='/'>
          <img
            src='/favicon.svg'
            alt='logo'
            width='30'
            height='30'
            className='me-2'
          />
          Book Lovers
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          aria-controls='navbarNav'
          aria-expanded={isOpen}
          aria-label='Toggle navigation'
          onClick={toggleMenu}
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
          id='navbarNav'
        >
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link
                className='nav-link'
                to='/books'
                onClick={() => setIsOpen(false)}
              >
                {t('books')}
              </Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
                    to='/login'
                    onClick={() => setIsOpen(false)}
                  >
                    {t('login')}
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
                    to='/register'
                    onClick={() => setIsOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
                    to='/add-book'
                    onClick={() => setIsOpen(false)}
                  >
                    {t('addBook')}
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
                    to='/books/my-books'
                    onClick={() => setIsOpen(false)}
                  >
                    {t('myBooks')}
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
                    to='/orders'
                    onClick={() => setIsOpen(false)}
                  >
                    {t('orders:title')}
                  </Link>
                </li>
                {user?.userType === 'regular' ? (
                  <li className='nav-item'>
                    <Link
                      className='nav-link'
                      to='/profile'
                      onClick={() => setIsOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                  </li>
                ) : (
                  <li className='nav-item'>
                    <Link
                      className='nav-link'
                      to='/ethereumProfile'
                      onClick={() => setIsOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                  </li>
                )}
                {user?.role === 'admin' && (
                  <li className='nav-item'>
                    <Link
                      className='nav-link'
                      to='/users'
                      onClick={() => setIsOpen(false)}
                    >
                      {t('users')}
                    </Link>
                  </li>
                )}
                <li className='nav-item'>
                  <button
                    className='nav-link btn btn-link'
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    {t('logout')}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
        <CartIcon />
        <select
          className='form-select form-select-sm me-3'
          value={language}
          onChange={handleLanguageChange}
          style={{ width: '120px' }}
        >
          <option value='en'>English</option>
          <option value='bg'>Български</option>
        </select>
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
