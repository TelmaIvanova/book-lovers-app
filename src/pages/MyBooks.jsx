import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useAuth } from '../context/AuthContext';
import apiBase from '../config/api';

const MyBooks = () => {
  const { t } = useTranslation(['myBooks']);
  const [books, setBooks] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchMyBooks = async () => {
      try {
        const res = await fetch(`${apiBase}/books/my-books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch my books');

        const data = await res.json();
        setBooks(data.data.books);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyBooks();
  }, [token, t]);

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('myBooks')}</title>
      </Helmet>

      <h1 className='mb-4'>{t('myBooks')}</h1>

      {books.length === 0 ? (
        <p>{t('noBooks')}</p>
      ) : (
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
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {(book.price?.amount / 100).toFixed(2)} EUR
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
