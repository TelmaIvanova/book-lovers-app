import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [cover, setCover] = useState('');
  const [genre, setGenre] = useState('');
  const [summary, setSummary] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      title,
      author,
      isbn,
      publishedYear,
      cover,
      genre,
      summary,
      comment,
      rating,
    };

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    if (res.ok) {
      navigate('/books');
    } else {
      console.error('Error adding book');
    }
  };

  return (
    <div className='container mt-4'>
      <h1>Add new book</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>Title</label>
          <input
            type='text'
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Author</label>
          <input
            type='text'
            className='form-control'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>ISBN</label>
          <input
            type='text'
            className='form-control'
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Published Year</label>
          <input
            type='text'
            className='form-control'
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Cover (URL)</label>
          <input
            type='text'
            className='form-control'
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Genre</label>
          <input
            type='text'
            className='form-control'
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Summary</label>
          <textarea
            className='form-control'
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          ></textarea>
        </div>
        <div className='mb-3'>
          <label className='form-label'>Comment (optional)</label>
          <textarea
            className='form-control'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <div className='mb-3'>
          <label className='form-label'>Rating</label>
          <input
            type='number'
            className='form-control'
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min='1'
            max='5'
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
