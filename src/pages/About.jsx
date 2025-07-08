import React from 'react';
import image from './../author.png';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation('about');

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('heading')}</h1>
      <div className='d-flex'>
        <img src={image} alt='authorImage' style={{ maxWidth: '200px' }} />
        <div>
          <h2>{t('authorName')}</h2>
          <p>{t('description')}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
