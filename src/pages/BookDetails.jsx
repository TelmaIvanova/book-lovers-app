import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import AddToCartButton from '../components/AddToCartButton';

const BookDetails = () => {
  const { t } = useTranslation('bookDetails');
  const [seller, setSeller] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [editingField, setEditingField] = useState(null);
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
        try {
          const sellerRes = await fetch(
            `/api/sellers/${data.data.book.seller}`
          );
          if (sellerRes.ok) {
            const sellerData = await sellerRes.json();
            setSeller(sellerData.seller);
          }
        } catch (err) {
          console.error(err);
        }
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

  const canEditPrice =
    user &&
    (user._id?.toString() === book?.seller?.toString() ||
      user.role === 'admin');

  const handleDelete = async () => {
    if (!window.confirm(t('delete.confirm'))) return;

    try {
      const res = await deleteBook(id);
      if (res?.status === 204 || res?.success) {
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

    const amt = (p.amount / 100).toFixed(2);
    return `${amt} EUR`;
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
          cursor: 'pointer',
        }}
        onClick={() => handleEdit('coverImage')}
      />

      {editingField === 'coverImage' && (
        <input
          type='file'
          accept='image/*'
          className='form-control mt-2'
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
              const form = new FormData();
              form.append('coverImage', file);

              const res = await fetch(`/api/books/${id}`, {
                method: 'PATCH',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: form,
              });

              if (!res.ok) throw new Error('Failed to update cover image');
              const updated = await res.json();

              setBook(updated.data.book);
              setFormData(updated.data.book);
            } catch (err) {
              console.error(err);
              alert(t('error.coverUpload'));
            } finally {
              setEditingField(null);
            }
          }}
          autoFocus
        />
      )}

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
        {editingField === 'price' ? (
          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}
          >
            <input
              type='number'
              step='0.01'
              className='form-control'
              style={{ width: '120px' }}
              defaultValue={(formData.price?.amount ?? book.price.amount) / 100}
              autoFocus
              onBlur={async (e) => {
                const eur = parseFloat(e.target.value.replace(',', '.'));
                const cents = isNaN(eur) ? 0 : Math.round(eur * 100);

                try {
                  await updateBook(id, {
                    price: {
                      amount: cents,
                      currency: 'EUR',
                      isFree: false,
                      isExchange: false,
                    },
                  });
                  setBook((prev) => ({
                    ...prev,
                    price: {
                      amount: cents,
                      currency: 'EUR',
                      isFree: false,
                      isExchange: false,
                    },
                  }));
                  setFormData((prev) => ({
                    ...prev,
                    price: {
                      amount: cents,
                      currency: 'EUR',
                      isFree: false,
                      isExchange: false,
                    },
                  }));
                } catch (err) {
                  console.error(err);
                } finally {
                  setEditingField(null);
                }
              }}
            />
            <span style={{ alignSelf: 'center' }}>EUR</span>
          </div>
        ) : (
          <span
            onClick={() => {
              const cur = formData.price ?? book.price;
              if (cur?.isFree || cur?.isExchange || !canEditPrice) return;
              handleEdit('price');
            }}
            style={{ cursor: canEditPrice ? 'pointer' : 'default' }}
          >
            {priceLabel}
          </span>
        )}
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
              {seller?.displayName ? (
                <Link to={`/sellers/${seller._id}`}>{seller.displayName}</Link>
              ) : (
                '—'
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <div className='mt-4'>
        <AddToCartButton book={book} />
      </div>
      {(user?._id?.toString() === book?.seller?.toString() ||
        user?.role === 'admin') && (
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
