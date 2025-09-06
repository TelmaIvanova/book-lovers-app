import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import AddToCartButton from '../components/AddToCartButton';
import { useAuth } from '../context/AuthContext';
import apiBase from '../config/api';

const Books = () => {
  const { t } = useTranslation(['book', 'bookDetails']);
  const [books, setBooks] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    fetch(`${apiBase}/books`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((response) => response.json())
      .then((data) => setBooks(data.data.books))
      .catch((error) => console.error(t('book:error.fetch'), error));
  }, [t, token]);

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('book:title')}</title>
      </Helmet>

      <h1 className='mb-4'>{t('book:heading')}</h1>
      <div className='row'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {books.map((book) => {
            const isEbook = book.type === 'E-book';
            const formatLabel = isEbook
              ? t('bookDetails:typeOptions.E-book')
              : t(`bookDetails:coverOptions.${book.cover}`);
            const statusLabel =
              !isEbook && book.status
                ? t(`bookDetails:statusOptions.${book.status}`)
                : '';

            const priceLabel = (() => {
              if (book.price && typeof book.price === 'object') {
                if (book.price.isFree) return t('bookDetails:price.free');
                if (book.price.isExchange)
                  return t('bookDetails:price.exchange');
                if (typeof book.price.amount === 'number') {
                  const amt = (book.price.amount / 100).toFixed(2);
                  return `${amt} EUR`;
                }
                return '-';
              }
              if (typeof book.price === 'number')
                return (book.price / 100).toFixed(2) + ' EUR';
              if (typeof book.price === 'string') return book.price + ' EUR';
              return '-';
            })();

            return (
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
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    minWidth: '220px',
                    gap: '8px',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    <span>{formatLabel}</span>
                    {statusLabel && (
                      <>
                        {' '}
                        | <span>{statusLabel}</span>
                      </>
                    )}
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {priceLabel}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      to={`/books/${book._id}`}
                      className='btn btn-secondary btn-sm'
                    >
                      {t('book:card.details')}
                    </Link>
                    <AddToCartButton book={book} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <br />
    </div>
  );
};

export default Books;
