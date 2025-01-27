import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className='container mt-4'>
      <h1>Add a New Book</h1>
      <form>
        <div className='mb-3'>
          <label htmlFor='bookTitle' className='form-label'>
            Title
          </label>
          <input type='text' className='form-control' id='bookTitle' required />
        </div>
        <div className='mb-3'>
          <label htmlFor='bookGenre' className='form-label'>
            Genre
          </label>
          <input type='text' className='form-control' id='bookGenre' required />
        </div>
        <button type='submit' className='btn btn-primary'>
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
