import React, { useState } from 'react';
import DarkModeToggle from '../components/DarkModeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
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
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <Link className='nav-link' to='/books'>
                {t('books')}
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/about'>
                {t('about')}
              </Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li className='nav-item'>
                  <Link className='nav-link' to='/login'>
                    {t('login')}
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/register'>
                    {t('register')}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link className='nav-link' to='/add-book'>
                    {t('addBook')}
                  </Link>
                </li>
                {user?.data?.user?.userType === 'regular' ? (
                  <li className='nav-item'>
                    <Link className='nav-link' to='/profile'>
                      {t('profile')}
                    </Link>
                  </li>
                ) : (
                  <li className='nav-item'>
                    <Link className='nav-link' to='/ethereumProfile'>
                      {t('profile')}
                    </Link>
                  </li>
                )}
                {user?.data?.user?.role === 'admin' && (
                  <li className='nav-item'>
                    <Link className='nav-link' to='/users'>
                      {t('users')}
                    </Link>
                  </li>
                )}
                <li className='nav-item'>
                  <button
                    className='nav-link btn btn-link'
                    onClick={handleLogout}
                  >
                    {t('logout')}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

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
