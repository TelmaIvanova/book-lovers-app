import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const AddBook = () => {
  const { t } = useTranslation('addBook');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [coverFile, setCoverFile] = useState(null);
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('isbn', isbn);
    formData.append('publishedYear', publishedYear);
    if (coverFile) {
      formData.append('photo', coverFile);
    }
    formData.append('genre', genre);
    formData.append('summary', summary);
    formData.append('comment', comment);
    formData.append('rating', rating);

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      navigate('/books');
    } else {
      console.error(t('error.addFailed'));
    }
  };

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('heading')}</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>{t('form.title')}</label>
          <input
            type='text'
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.author')}</label>
          <input
            type='text'
            className='form-control'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.isbn')}</label>
          <input
            type='text'
            className='form-control'
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.publishedYear')}</label>
          <input
            type='text'
            className='form-control'
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.cover')}</label>
          <input
            type='file'
            accept='image/*'
            className='form-control'
            onChange={(e) => setCoverFile(e.target.files[0])}
            required
          />
          {coverFile && (
            <img
              src={URL.createObjectURL(coverFile)}
              alt='Cover preview'
              style={{
                display: 'block',
                margin: '10px auto 0',
                maxWidth: '200px',
              }}
            />
          )}
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.genre')}</label>
          <input
            type='text'
            className='form-control'
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.summary')}</label>
          <textarea
            className='form-control'
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          ></textarea>
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.comment')}</label>
          <textarea
            className='form-control'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.rating')}</label>
          <input
            type='number'
            className='form-control'
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min='1'
            max='5'
          />
        </div>
        <button
          type='submit'
          className='btn btn-primary'
          disabled={!coverFile || !title || !author}
        >
          {t('form.submit')}
        </button>
        <br />
      </form>
    </div>
  );
};

export default AddBook;
