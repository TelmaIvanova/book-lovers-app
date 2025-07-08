import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const Home = () => {
  const { t } = useTranslation('home');

  return (
    <div className='home-page'>
       <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <section className='intro py-5 text-center'>
        <div className='container'>
          <h1 className='display-4'>{t('intro.heading')}</h1>
          <p className='lead mt-3'>{t('intro.description')}</p>
          <ul className='list-unstyled mt-4 text-start d-inline-block'>
            <li>{t('intro.features.reviews')}</li>
            <li>{t('intro.features.genre')}</li>
            <li>{t('intro.features.comments')}</li>
            <li>{t('intro.features.rate')}</li>
            <li>{t('intro.features.addBooks')}</li>
          </ul>
        </div>
      </section>

      <section className='how-to-start py-5'>
        <div className='container'>
          <h2 className='text-center mb-4'>{t('gettingStarted.heading')}</h2>
          <div className='row text-center'>
            <div className='col-md-3'>
              <p>
                <Link to='/register' className='text-primary'>
                  {t('gettingStarted.register')}
                </Link>
              </p>
            </div>
            <div className='col-md-3'>
              <p>
                <Link to='/books' className='text-primary'>
                  {t('gettingStarted.browse')}
                </Link>
              </p>
            </div>
            <div className='col-md-3'>
              <p>
                <Link to='/login' className='text-primary'>
                  {t('gettingStarted.interact')}
                </Link>
              </p>
            </div>
            <div className='col-md-3'>
              <p>
                <Link to='/register' className='text-primary'>
                  {t('gettingStarted.groups')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='register-now py-5 bg-dark text-white text-center'>
        <div className='container'>
          <h2>{t('registerNow.heading')}</h2>
          <p className='mt-3'>{t('registerNow.description')}</p>
          <ul className='list-unstyled'>
            <li>{t('registerNow.features.wishlist')}</li>
            <li>{t('registerNow.features.rateReview')}</li>
            <li>{t('registerNow.features.groups')}</li>
          </ul>
          <a href='/register' className='btn btn-primary btn-lg mt-4'>
            {t('registerNow.button')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
