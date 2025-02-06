import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books')
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.data.books);
      })
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>Books</h1>
      <div className='mb-3'>
        <Link to='/add-book' className='btn btn-primary'>
          Add New Book
        </Link>
      </div>
      <div className='row'>
        {books.map((book) => (
          <div className='col-md-4 mb-4' key={book._id}>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>{book.title}</h5>
                <p className='card-text'>Genre: {book.genre}</p>
                <p className='card-text'>Rating: {book.rating}</p>
                <Link to={`/books/${book._id}`} className='btn btn-secondary'>
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
