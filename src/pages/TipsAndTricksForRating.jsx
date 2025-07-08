import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const TipsAndTricksForRating = () => {
  const { t } = useTranslation('tipsAndTricks');

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1 className='mb-4'>{t('heading')}</h1>
      <p>
        <strong>{t('intro')}</strong>
      </p>

      <div className='mt-4'>
        <h3>{t('stars.1.title')}</h3>
        <p>{t('stars.1.paragraph')}</p>
      </div>

      <div className='mt-4'>
        <h3>{t('stars.2.title')}</h3>
        <p>{t('stars.2.paragraph')}</p>
      </div>

      <div className='mt-4'>
        <h3>{t('stars.3.title')}</h3>
        <p>{t('stars.3.paragraph')}</p>
      </div>

      <div className='mt-4'>
        <h3>{t('stars.4.title')}</h3>
        <p>{t('stars.4.paragraph')}</p>
      </div>

      <div className='mt-4'>
        <h3>{t('stars.5.title')}</h3>
        <p>{t('stars.5.paragraph')}</p>
      </div>

      <div className='mt-4'>
        <p>
          <em>
            {t('reference')}:{' '}
            <a
              href='https://www.onbookstreet.com/blog/book-rating-system'
              target='_blank'
              rel='noopener noreferrer'
            >
              onbookstreet.com
            </a>
          </em>
        </p>
      </div>
    </div>
  );
};

export default TipsAndTricksForRating;
