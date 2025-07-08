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
        {books.map((book) => (
          <div className='col-md-4 mb-4' key={book._id}>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>{book.title}</h5>
                <p className='card-text'>
                  {t('card.author')}: {book.author}
                </p>
                <p className='card-text'>
                  {t('card.genre')}: {book.genre}
                </p>
                <p className='card-text'>
                  {t('card.rating')}: {book.rating}
                </p>
                <Link to={`/books/${book._id}`} className='btn btn-secondary'>
                  {t('card.details')}
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
