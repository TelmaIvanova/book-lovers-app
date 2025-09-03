import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enNavbar from './locales/en/navbar.json';
import bgNavbar from './locales/bg/navbar.json';
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
import enUserDetails from './locales/en/userDetails.json';
import bgUserDetails from './locales/bg/userDetails.json';
import enUsers from './locales/en/users.json';
import bgUsers from './locales/bg/users.json';
import enShoppingCart from './locales/en/shoppingCart.json';
import bgShoppingCart from './locales/bg/shoppingCart.json';
import enCheckout from './locales/en/checkout.json';
import bgCheckout from './locales/bg/checkout.json';
import enOrders from './locales/en/orders.json';
import bgOrders from './locales/bg/orders.json';
import bgMyBooks from './locales/bg/myBooks.json';
import enMyBooks from './locales/en/myBooks.json';
import bgSeller from './locales/bg/seller.json';
import enSeller from './locales/en/seller.json';
import enMessages from './locales/en/messages.json';
import bgMessages from './locales/bg/messages.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      navbar: enNavbar,
      addBook: enAddBook,
      book: enBook,
      bookDetails: enBookDetails,
      createUser: enCreateUser,
      ethereumProfile: enEthereumProfile,
      home: enHome,
      login: enLogin,
      profile: enProfile,
      register: enRegister,
      userDetails: enUserDetails,
      users: enUsers,
      shoppingCart: enShoppingCart,
      checkout: enCheckout,
      orders: enOrders,
      myBooks: enMyBooks,
      seller: enSeller,
      messages: enMessages,
    },
    bg: {
      navbar: bgNavbar,
      addBook: bgAddBook,
      book: bgBook,
      bookDetails: bgBookDetails,
      createUser: bgCreateUser,
      ethereumProfile: bgEthereumProfile,
      home: bgHome,
      login: bgLogin,
      profile: bgProfile,
      register: bgRegister,
      userDetails: bgUserDetails,
      users: bgUsers,
      shoppingCart: bgShoppingCart,
      checkout: bgCheckout,
      orders: bgOrders,
      myBooks: bgMyBooks,
      seller: bgSeller,
      messages: bgMessages,
    },
  },
  lng: localStorage.getItem('language') || 'bg',
  fallbackLng: 'bg',
  ns: [
    'navbar',
    'auth',
    'addBook',
    'book',
    'bookDetails',
    'createUser',
    'ethereumProfile',
    'home',
    'login',
    'profile',
    'register',
    'userDetails',
    'users',
    'shoppingCart',
    'checkout',
    'orders',
    'myBooks',
    'seller',
    'messages',
  ],
  interpolation: { escapeValue: false },
});

export default i18n;
