import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enNavbar from './locales/en/navbar.json';
import bgNavbar from './locales/bg/navbar.json';
import enAbout from './locales/en/about.json';
import bgAbout from './locales/bg/about.json';
import enAddBook from './locales/en/addBook.json';
import bgAddBook from './locales/bg/addBook.json';
import enBook from './locales/en/books.json';
import bgBook from './locales/bg/books.json';
import enBookDetails from './locales/en/bookDetails.json';
import bgBookDetails from './locales/bg/bookDetails.json';
import enCreateUser from './locales/en/createUser.json';
import bgCreateUser from './locales/bg/createUser.json';
import enEthereumProfile from './locales/en/ethereumProfile.json';
import bgEthereumProfile from './locales/bg/ethereumProfile.json';
import enHome from './locales/en/home.json';
import bgHome from './locales/bg/home.json';
import enLogin from './locales/en/login.json';
import bgLogin from './locales/bg/login.json';
import enProfile from './locales/en/profile.json';
import bgProfile from './locales/bg/profile.json';
import enRegister from './locales/en/registration.json';
import bgRegister from './locales/bg/registration.json';
import enTipsAndTricks from './locales/en/tipsAndTricksForRating.json';
import bgTipsAndTricks from './locales/bg/tipsAndTricksForRating.json';
import enUserDetails from './locales/en/userDetails.json';
import bgUserDetails from './locales/bg/userDetails.json';
import enUsers from './locales/en/users.json';
import bgUsers from './locales/bg/users.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      navbar: enNavbar,
      about: enAbout,
      addBook: enAddBook,
      book: enBook,
      bookDetails: enBookDetails,
      createUser: enCreateUser,
      ethereumProfile: enEthereumProfile,
      home: enHome,
      login: enLogin,
      profile: enProfile,
      register: enRegister,
      tipsAndTricks: enTipsAndTricks,
      userDetails: enUserDetails,
      users: enUsers,
    },
    bg: {
      navbar: bgNavbar,
      about: bgAbout,
      addBook: bgAddBook,
      book: bgBook,
      bookDetails: bgBookDetails,
      createUser: bgCreateUser,
      ethereumProfile: bgEthereumProfile,
      home: bgHome,
      login: bgLogin,
      profile: bgProfile,
      register: bgRegister,
      tipsAndTricks: bgTipsAndTricks,
      userDetails: bgUserDetails,
      users: bgUsers,
    },
  },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  ns: [
    'navbar',
    'auth',
    'about',
    'addBook',
    'book',
    'bookDetails',
    'createUser',
    'ethereumProfile',
    'home',
    'login',
    'profile',
    'register',
    'tipsAndTricks',
    'userDetails',
    'users',
  ],
  defaultNS: 'auth',
  interpolation: { escapeValue: false },
});

export default i18n;
