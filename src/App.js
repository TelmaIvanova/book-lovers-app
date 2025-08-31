import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import Profile from './pages/Profile';
import EthereumProfile from './pages/EthereumProfile';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import CreateUser from './pages/CreateUser';
import Login from './pages/Login';
import Register from './pages/Registration';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import MyBooks from './pages/MyBooks';
import Seller from './pages/Seller';

const App = () => (
  <>
    <Navbar />
    <div className='container mt-4'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/books' element={<Books />} />
        <Route path='/books/:id' element={<BookDetails />} />
        <Route path='/books/my-books' element={<MyBooks />} />
        <Route path='/add-book' element={<AddBook />} />
        <Route path='/cart' element={<ShoppingCart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/sellers/:id' element={<Seller />} />
        <Route path='/orders/:id' element={<OrderDetails />} />
        <Route path='/ethereumProfile' element={<EthereumProfile />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<UserDetails />} />
        <Route path='/create-user' element={<CreateUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  </>
);

export default App;
