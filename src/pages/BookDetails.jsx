import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const BookDetails = () => {
  const { t } = useTranslation('bookDetails');
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
        if (!res.ok) throw new Error(t('error.fetch'));
        const data = await res.json();
        setBook(data.data.book);
        setFormData(data.data.book);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBook();
  }, [id, t]);

  const handleEdit = (field) => {
    setEditingField(field);
    if (formData[field] === undefined || formData[field] === null) {
      setFormData((prev) => ({ ...prev, [field]: '' }));
    }
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
      alert(t('ratingEdit.alertInvalid'));
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
        alert(t('ratingEdit.success'));
      } else {
        const errorData = await res.json();
        alert(errorData.message || t('ratingEdit.failure'));
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      alert(t('ratingEdit.error'));
    }
  };

  const handleBuy = async () => {};

  const handleDelete = async () => {
    if (user?.data?.user?.role !== 'admin') return;
    if (!window.confirm(t('delete.confirm'))) return;

    try {
      const res = await deleteBook(id);
      if (res?.status === 204) {
        alert(t('delete.success'));
        navigate('/books');
      }
    } catch (error) {
      console.error(error);
      alert(t('delete.failure'));
    }
  };

  if (!book) return <p>{t('loading')}</p>;

  const priceLabel = (() => {
    const p = formData.price || book.price;

    if (p.isFree) return t('price.free');
    if (p.isExchange) return t('price.exchange');

    return `${p.amount.toFixed(2)}${p.currency ? ' ' + p.currency : ''}`;
  })();

  const statusLabel = t(`statusOptions.${formData.status ?? book.status}`, {
    defaultValue: formData.status ?? book.status,
  });
  const typeLabel = t(`typeOptions.${formData.type ?? book.type}`, {
    defaultValue: formData.type ?? book.type,
  });
  const coverLabel = t(`coverOptions.${formData.cover ?? book.cover}`, {
    defaultValue: formData.cover ?? book.cover,
  });

  return (
    <div className='container mt-4 text-center'>
      <Helmet>
        <title>
          {formData.title} - {formData.author}
        </title>
      </Helmet>

      <img
        src={book.coverImage}
        alt={book.title}
        style={{
          width: '150px',
          height: 'auto',
          display: 'block',
          margin: '0 auto 1rem auto',
        }}
      />
      <h1 className='mb-4'>
        {editingField === 'title' ? (
          <input
            type='text'
            name='title'
            className='form-control'
            value={formData.title}
            onChange={handleChange}
            onBlur={() => handleBlur('title')}
            autoFocus
          />
        ) : (
          <span onClick={() => handleEdit('title')}>{book.title}</span>
        )}
      </h1>
      <h2 className='mb-3'>
        {(() => {
          const p = formData.price ?? book.price;
          const editablePrice = p && !p.isFree && !p.isExchange;

          if (editingField === 'price' && editablePrice) {
            return (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    handleBlur('price');
                  }
                }}
              >
                <input
                  type='number'
                  name='amount'
                  className='form-control'
                  style={{ width: '120px' }}
                  value={
                    formData.price?.amount === undefined ||
                    formData.price?.amount === null
                      ? ''
                      : formData.price.amount
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      price: {
                        ...(prev.price || {}),
                        isFree: false,
                        isExchange: false,
                        amount: raw === '' ? undefined : Number(raw),
                      },
                    }));
                  }}
                  autoFocus
                />
                <select
                  name='currency'
                  className='form-select'
                  style={{ width: '100px' }}
                  value={formData.price?.currency ?? 'BGN'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: {
                        ...(prev.price || {}),
                        isFree: false,
                        isExchange: false,
                        currency: e.target.value,
                      },
                    }))
                  }
                >
                  <option value='BGN'>BGN</option>
                  <option value='EUR'>EUR</option>
                  <option value='ETH'>ETH</option>
                </select>
              </div>
            );
          }

          return (
            <span
              onClick={() => {
                const cur = formData.price ?? book.price;
                if (cur?.isFree || cur?.isExchange) return;
                handleEdit('price');
              }}
              style={{ cursor: editablePrice ? 'pointer' : 'default' }}
            >
              {priceLabel}
            </span>
          );
        })()}
      </h2>
      <table
        style={{
          margin: '0 auto',
          textAlign: 'left',
          borderSpacing: '40px 10px',
        }}
      >
        <tbody>
          <tr>
            <td style={{ fontWeight: 'bold' }}>{t('author')}:</td>
            <td style={{ width: '200px' }}>
              {editingField === 'author' ? (
                <input
                  type='text'
                  name='author'
                  className='form-control'
                  value={formData.author}
                  onChange={handleChange}
                  onBlur={() => handleBlur('author')}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit('author')}>{book.author}</span>
              )}
            </td>
            <td style={{ fontWeight: 'bold' }}>{t('isbn')}:</td>
            <td style={{ width: '200px' }}>
              {editingField === 'isbn' ? (
                <input
                  type='text'
                  name='isbn'
                  className='form-control'
                  value={formData.isbn}
                  onChange={handleChange}
                  onBlur={() => handleBlur('isbn')}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit('isbn')}>{book.isbn}</span>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>{t('publisher')}:</td>
            <td style={{ width: '100px' }}>
              {editingField === 'publisher' ? (
                <input
                  type='text'
                  name='publisher'
                  className='form-control'
                  value={formData.publisher}
                  onChange={handleChange}
                  onBlur={() => handleBlur('publisher')}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit('publisher')}>
                  {book.publisher}
                </span>
              )}
            </td>
            <td style={{ fontWeight: 'bold' }}>{t('publishedYear')}:</td>
            <td style={{ width: '100px' }}>
              {editingField === 'publishedYear' ? (
                <input
                  type='number'
                  name='publishedYear'
                  className='form-control'
                  value={formData.publishedYear}
                  onChange={handleChange}
                  onBlur={() => handleBlur('publishedYear')}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit('publishedYear')}>
                  {book.publishedYear}
                </span>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>{t('status')}:</td>
            <td style={{ width: '100px' }}>
              {editingField === 'status' ? (
                <select
                  name='status'
                  className='form-select'
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={() => handleBlur('status')}
                  autoFocus
                >
                  <option value='New'>{t('statusOptions.New')}</option>
                  <option value='VeryGood'>
                    {t('statusOptions.VeryGood')}
                  </option>
                  <option value='Good'>{t('statusOptions.Good')}</option>
                  <option value='Bad'>{t('statusOptions.Bad')}</option>
                </select>
              ) : (
                <span onClick={() => handleEdit('status')}>{statusLabel}</span>
              )}
            </td>
            <td style={{ fontWeight: 'bold' }}>{t('type')}:</td>
            <td style={{ width: '100px' }}>
              {editingField === 'type' ? (
                <select
                  name='type'
                  className='form-select'
                  value={formData.type}
                  onChange={handleChange}
                  onBlur={() => handleBlur('type')}
                  autoFocus
                >
                  <option value='E-book'>{t('typeOptions.E-book')}</option>
                  <option value='OnPaper'>{t('typeOptions.OnPaper')}</option>
                </select>
              ) : (
                <span onClick={() => handleEdit('type')}>{typeLabel}</span>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>{t('language')}:</td>
            <td style={{ width: '100px' }}>
              {editingField === 'language' ? (
                <input
                  type='text'
                  name='language'
                  className='form-control'
                  value={formData.language}
                  onChange={handleChange}
                  onBlur={() => handleBlur('language')}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit('language')}>
                  {book.language}
                </span>
              )}
            </td>
            <td style={{ fontWeight: 'bold' }}>{t('pages')}:</td>
            <td style={{ width: '100px' }}>
              {editingField === 'pages' ? (
                <input
                  type='number'
                  name='pages'
                  className='form-control'
                  value={formData.pages}
                  onChange={handleChange}
                  onBlur={() => handleBlur('pages')}
                  autoFocus
                />
              ) : (
                <span onClick={() => handleEdit('pages')}>{book.pages}</span>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>{t('cover')}:</td>
            <td style={{ width: '100px' }}>
              {editingField === 'cover' ? (
                <select
                  name='cover'
                  className='form-select'
                  value={formData.cover || ''}
                  onChange={handleChange}
                  onBlur={() => handleBlur('cover')}
                  autoFocus
                >
                  <option value='hardcover'>
                    {t('coverOptions.hardcover')}
                  </option>
                  <option value='softcover'>
                    {t('coverOptions.softcover')}
                  </option>
                </select>
              ) : (
                <span onClick={() => handleEdit('cover')}>{coverLabel}</span>
              )}
            </td>
            <td style={{ fontWeight: 'bold' }}>{t('comment')}:</td>
            <td
              style={{
                width: '100px',
                cursor: editingField === 'comment' ? 'auto' : 'pointer',
              }}
              onClick={() =>
                editingField !== 'comment' && handleEdit('comment')
              }
            >
              {editingField === 'comment' ? (
                <textarea
                  name='comment'
                  className='form-control'
                  value={formData.comment ?? ''}
                  onChange={handleChange}
                  onBlur={() => handleBlur('comment')}
                  autoFocus
                  rows={1}
                />
              ) : formData.comment ?? book.comment ? (
                <span>{formData.comment ?? book.comment}</span>
              ) : (
                <span className='text-muted fst-italic'>{t('addComment')}</span>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ fontWeight: 'bold' }}>{t('seller')}:</td>
            <td colSpan='3'>
              <Link to={`/profile/${book.seller?._id || 'dummy-id'}`}>
                {book.seller?.name || 'Dummy Seller'}
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      <div className='mt-4'>
        <button className='btn btn-primary' onClick={handleBuy}>
          {t('buy')}
        </button>
      </div>

      {user?.data?.user?.role === 'admin' && (
        <div className='mt-4'>
          <button className='btn btn-danger' onClick={handleDelete}>
            {t('delete.button')}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
