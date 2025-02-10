import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingRating, setEditingRating] = useState(false);
  const [newRating, setNewRating] = useState('');
  const [formData, setFormData] = useState({});
  const { user, updateBook, token, deleteBook } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch book');
        const data = await res.json();
        setBook(data.data.book);
        setFormData(data.data.book);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBook();
  }, [id]);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = async (field) => {
    try {
      await updateBook(id, { [field]: formData[field] });
      setBook((prevBook) => ({ ...prevBook, [field]: formData[field] }));
    } catch (error) {
      console.error(error);
    } finally {
      setEditingField(null);
    }
  };

  const handleRatingUpdate = async () => {
    if (!newRating || newRating < 1 || newRating > 5) {
      alert('Please provide a valid rating between 1 and 5.');
      return;
    }

    try {
      const res = await fetch(`/api/books/${id}/rate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newVote: newRating }),
      });

      if (res.ok) {
        const updatedBook = await res.json();
        setBook(updatedBook.data.book);
        setEditingRating(false);
        setNewRating('');
        alert('Rating updated successfully!');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to update rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('An error occurred while updating the rating.');
    }
  };

  const handleDelete = async () => {
    if (user?.data?.user?.role !== 'admin') return;
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const res = await deleteBook(id);
      if (res?.status === 204) {
        alert('Book deleted successfully!');
        navigate('/books');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete the book.');
    }
  };

  if (!book) return <p>Loading book details...</p>;

  return (
    <div className='container mt-4'>
      <h1>
        {editingField === 'title' ? (
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            onBlur={() => handleBlur('title')}
            autoFocus
          />
        ) : (
          <span onClick={() => handleEdit('title')}>{book.title}</span>
        )}
      </h1>

      <p>
        <strong>Author:</strong>{' '}
        {editingField === 'author' ? (
          <input
            type='text'
            name='author'
            value={formData.author}
            onChange={handleChange}
            onBlur={() => handleBlur('author')}
            autoFocus
          />
        ) : (
          <span onClick={() => handleEdit('author')}>{book.author}</span>
        )}
      </p>

      <p>
        <strong>Genre:</strong>{' '}
        {editingField === 'genre' ? (
          <input
            type='text'
            name='genre'
            value={formData.genre}
            onChange={handleChange}
            onBlur={() => handleBlur('genre')}
            autoFocus
          />
        ) : (
          <span onClick={() => handleEdit('genre')}>{book.genre}</span>
        )}
      </p>

      <p>
        <strong>Summary:</strong>{' '}
        {editingField === 'summary' ? (
          <textarea
            name='summary'
            value={formData.summary}
            onChange={handleChange}
            onBlur={() => handleBlur('summary')}
            autoFocus
          />
        ) : (
          <span onClick={() => handleEdit('summary')}>{book.summary}</span>
        )}
      </p>

      <p>
        <strong>Rating:</strong>{' '}
        {editingRating ? (
          <div>
            <input
              type='number'
              min='1'
              max='5'
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              className='form-control d-inline-block w-auto'
            />
            <button
              onClick={handleRatingUpdate}
              className='btn btn-primary ms-2'
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingRating(false);
                setNewRating('');
              }}
              className='btn btn-secondary ms-2'
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            {book.rating} ⭐{' '}
            <i
              className='bi bi-pencil-square'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setEditingRating(true);
                setNewRating(book.rating);
              }}
            ></i>
            <div className='mt-3'>
              <p>
                <Link to='/tips-and-tricks' className='text-primary'>
                  Not sure how to rate? Check our tips and tricks!
                </Link>
              </p>
            </div>
          </>
        )}
      </p>

      {user?.data?.user?.role === 'admin' && (
        <div className='mt-4'>
          <button className='btn btn-danger' onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
