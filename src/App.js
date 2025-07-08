import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBooks';
import Profile from './pages/Profile';
import EthereumProfile from './pages/EthereumProfile';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import CreateUser from './pages/CreateUser';
import Login from './pages/Login';
import Register from './pages/Registration';
import About from './pages/About';
import TipsAndTricksForRating from './pages/TipsAndTricksForRating';

const App = () => (
  <>
    <Navbar />
    <div className='container mt-4'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/books' element={<Books />} />
        <Route path='/books/:id' element={<BookDetails />} />
        <Route path='/add-book' element={<AddBook />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/ethereumProfile' element={<EthereumProfile />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<UserDetails />} />
        <Route path='/create-user' element={<CreateUser />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />
        <Route path='/tips-and-tricks' element={<TipsAndTricksForRating />} />
      </Routes>
    </div>
  </>
);

export default App;
