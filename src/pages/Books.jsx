import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const Books = () => {
  const { t } = useTranslation('book');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books')
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.data.books);
      })
      .catch((error) => console.error(t('error.fetch'), error));
  }, [t]);

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1 className='mb-4'>{t('heading')}</h1>
      <div className='mb-3'>
        <Link to='/add-book' className='btn btn-primary'>
          {t('addButton')}
        </Link>
      </div>
      <div className='row'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {books.map((book) => (
            <div
              key={book._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                width: '100%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={book.coverImage}
                alt={book.title}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginRight: '16px',
                }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 8px' }}>
                  <Link
                    to={`/books/${book._id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {book.title}
                  </Link>
                </h2>
                <p style={{ margin: '0 0 4px', color: '#555' }}>
                  {book.author}
                </p>
                <p style={{ margin: 0, color: '#777', fontSize: '14px' }}>
                  {book.summary?.length > 150
                    ? book.summary.slice(0, 150) + '...'
                    : book.summary}
                </p>
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <Link to={`/books/${book._id}`} className='btn btn-secondary'>
                   {t('card.details')}
                </Link>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    //todo: add to card function
                  }}
                >
                  {t('card.buy')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />
    </div>
  );
};

export default Books;
