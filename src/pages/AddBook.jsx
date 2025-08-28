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
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [language, setLanguage] = useState('');
  const [languageOther, setLanguageOther] = useState('');
  const [pages, setPages] = useState('');
  const [coverType, setCoverType] = useState('');
  const [price, setPrice] = useState({
    amount: '',
    currency: '',
    isFree: false,
    isExchange: false,
  });
  const [publisher, setPublisher] = useState('');

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handlePriceChange = (field, value) => {
    setPrice((prev) => ({
      ...prev,
      [field]: field === 'amount' ? Number(value) : value,
    }));
  };

  const appendPriceToFormData = (formData, price) => {
    if (!price.isFree && !price.isExchange) {
      const amountToSend = Number(price.amount) || 0;
      formData.append('price.amount', Math.round(amountToSend * 100));
    } else {
      formData.append('price.amount', 0);
    }

    formData.append('price.isFree', price.isFree);
    formData.append('price.isExchange', price.isExchange);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('isbn', isbn);
    formData.append('publishedYear', publishedYear);
    if (coverFile) {
      formData.append('coverImage', coverFile);
    }
    formData.append('publisher', publisher);
    formData.append('genre', genre);
    formData.append('status', status);
    formData.append('type', type);
    const languageValue = language === 'Other' ? languageOther : language;
    formData.append('language', languageValue);
    formData.append('pages', pages);
    if (coverType !== '') {
      formData.append('cover', coverType);
    }
    formData.append('summary', summary);
    formData.append('comment', comment);
    formData.append('newVote', rating);
    appendPriceToFormData(formData, price, user.userType);
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
        <div className='mb-3 text-center'>
          <div className='d-inline-flex gap-3 align-items-center'>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                id='isFree'
                checked={price.isFree}
                onChange={(e) => handlePriceChange('isFree', e.target.checked)}
              />
              <label className='form-check-label' htmlFor='isFree'>
                {t('bookDetails:price.free')}
              </label>
            </div>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                id='isExchange'
                checked={price.isExchange}
                onChange={(e) =>
                  handlePriceChange('isExchange', e.target.checked)
                }
              />
              <label className='form-check-label' htmlFor='isExchange'>
                {t('bookDetails:price.exchange')}
              </label>
            </div>
          </div>
        </div>
        {!price.isFree && !price.isExchange && (
          <>
            <div className='mb-3'>
              <label htmlFor='priceAmount' className='form-label d-block'>
                {t('form.price')}
              </label>
              <div
                className='d-flex justify-content-center align-items-center'
                style={{ maxWidth: '400px', margin: '0 auto' }}
              >
                <input
                  type='number'
                  id='priceAmount'
                  className='form-control'
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  min='0'
                  value={price.amount}
                  onChange={(e) => handlePriceChange('amount', e.target.value)}
                  disabled={price.isFree || price.isExchange}
                  required={!price.isFree && !price.isExchange}
                />
                <span
                  className='input-group-text'
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: '100px',
                    textAlign: 'center',
                  }}
                >
                  <span className='input-group-text'>EUR</span>
                </span>
              </div>
            </div>
          </>
        )}
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
          <label className='form-label'>{t('form.publisher')}</label>
          <input
            type='text'
            className='form-control'
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
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
          <label className='form-label'>{t('form.status')}</label>
          <select
            className='form-select'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value='' disabled>
              {t('form.status')}
            </option>
            <option value='New'>{t('form.statusOptions.New')}</option>
            <option value='VeryGood'>{t('form.statusOptions.VeryGood')}</option>
            <option value='Good'>{t('form.statusOptions.Good')}</option>
            <option value='Bad'>{t('form.statusOptions.Bad')}</option>
          </select>
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.type')}</label>
          <select
            className='form-select'
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value='' disabled>
              {t('form.type')}
            </option>
            <option value='E-book'>{t('form.typeOptions.E-book')}</option>
            <option value='OnPaper'>{t('form.typeOptions.OnPaper')}</option>
          </select>
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.language')}</label>
          <select
            className='form-select'
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            <option value='' disabled>
              {t('form.language')}
            </option>
            <option value='English'>{t('form.languageOptions.English')}</option>
            <option value='Bulgarian'>
              {t('form.languageOptions.Bulgarian')}
            </option>
            <option value='Other'>{t('form.languageOptions.Other')}</option>
          </select>
        </div>
        {language === 'Other' && (
          <div className='mb-3'>
            <label className='form-label'>
              {t('form.languageOptions.enterLanguage')}
            </label>
            <input
              type='text'
              className='form-control'
              value={languageOther}
              onChange={(e) => setLanguageOther(e.target.value)}
              required
            />
          </div>
        )}
        <div className='mb-3'>
          <label className='form-label'>{t('form.pages')}</label>
          <input
            type='number'
            className='form-control'
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            min='1'
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>{t('form.cover')}</label>
          <select
            className='form-select'
            value={coverType}
            onChange={(e) => setCoverType(e.target.value)}
          >
            <option value=''>-</option>
            <option value='hardcover'>
              {t('form.coverOptions.hardcover')}
            </option>
            <option value='softcover'>
              {t('form.coverOptions.softcover')}
            </option>
          </select>
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
