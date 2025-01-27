import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import AddBook from './pages/AddBooks';
import Login from './pages/Login';
import Register from './pages/Registration';

const App = () => (
  <>
    <Navbar />
    <div className='container mt-4'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/books' element={<Books />} />
        <Route path='/add-book' element={<AddBook />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  </>
);

export default App;
