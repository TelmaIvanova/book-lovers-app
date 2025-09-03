import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchSeller } from '../api/sellerApi';
import { Helmet } from 'react-helmet';
import AddToCartButton from '../components/AddToCartButton';
import SellerRating from '../components/SellerRating';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Seller() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['seller', 'book', 'bookDetails']);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSeller(id, token);
        setSeller(data.seller);
        setBooks(data.books || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, token]);

  if (loading) return <p>{t('seller:loading')}</p>;
  if (!seller) return <p>{t('seller:notFound')}</p>;

  const handleChat = () => {
    navigate(`/messages/${seller._id}`);
  };

  const displayName =
    seller.firstName && seller.lastName
      ? `${seller.firstName} ${seller.lastName}`
      : seller.username || `Ethereum ${t('seller:user')}`;

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{displayName}</h1>

      <SellerRating sellerId={seller._id} token={token} />

      {seller.contact && (
        <p>
          <strong>{t('seller:contact')}:</strong> {seller.contact}
        </p>
      )}
      <p>
        <strong>{t('seller:booksOffered')}:</strong> {seller.booksCount ?? 0}
      </p>
      <div style={{ margin: '16px 0' }}>
        <button onClick={handleChat} className='btn btn-primary'>
          {t('seller:chatButton')}
        </button>
      </div>
      <h2 className='mt-5'>{t('book:heading')}</h2>
      <div className='row'>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          }}
        >
          {books.length === 0 && <p>{t('book:noBooks')}</p>}
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
    </div>
  );
}
