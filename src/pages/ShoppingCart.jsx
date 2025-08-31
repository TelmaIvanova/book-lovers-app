import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PayWithEthereum from './../components/PayWithEthereum';

export default function ShoppingCart() {
  const {
    physicalItems = [],
    ebookItems = [],
    loading,
    remove,
    checkoutPhysical,
  } = useCart();
  const { t } = useTranslation('shoppingCart');
  const { token } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className='container mt-4'>
        <h1>{t('title')}</h1>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!physicalItems.length && !ebookItems.length) {
    return (
      <div className='container mt-4'>
        <h1>{t('title')}</h1>
        <p>{t('empty')}</p>
      </div>
    );
  }

  const money = (m) => (m / 100).toFixed(2);

  const getSellerId = (seller) =>
    typeof seller === 'object' ? seller._id?.toString() : seller?.toString();

  const uniqueSellersPhysical = new Set(
    physicalItems.map((it) => getSellerId(it.seller))
  );
  const deliveryCount = uniqueSellersPhysical.size;

  const groupBySeller = (items) => {
    const groups = {};
    items.forEach((it) => {
      const id = getSellerId(it.seller);
      if (!groups[id]) groups[id] = { seller: it.seller, items: [] };
      groups[id].items.push(it);
    });
    return Object.values(groups);
  };

  const physicalGroups = groupBySeller(physicalItems);
  const ebookGroups = groupBySeller(ebookItems);

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('title')}</h1>

      {physicalGroups.length > 0 && (
        <>
          <h3>{t('physical')}</h3>
          {physicalGroups.map((group, idx) => {
            const sellerName =
              typeof group.seller === 'object'
                ? group.seller.firstName || group.seller.username || 'Seller'
                : 'Seller';
            return (
              <div key={idx} className='mb-3'>
                <div className='text-center fw-bold fs-5 mb-2'>
                  {t('sellerLabel')}:{' '}
                  <Link to={`/sellers/${getSellerId(group.seller)}`}>
                    {sellerName}
                  </Link>
                </div>
                <ul className='list-group'>
                  {group.items.map((it) => (
                    <li
                      key={it._id}
                      className='list-group-item position-relative'
                    >
                      <div>
                        <div>{it.title}</div>
                        <small>{money(it.unitPriceMinor)} EUR</small>
                      </div>
                      <button
                        className='btn btn-sm btn-outline-danger position-absolute end-0 me-1 top-50 translate-middle-y'
                        style={{ width: '100px' }}
                        onClick={() => remove(it._id)}
                      >
                        {t('remove')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {physicalItems.length > 1 && deliveryCount > 1 && (
            <div className='alert alert-info mt-2'>
              {t('deliveryInfo', { count: deliveryCount })}
            </div>
          )}
          <button className='btn btn-primary mb-4' onClick={checkoutPhysical}>
            {t('checkoutPhysical')}
          </button>
        </>
      )}

      {ebookGroups.length > 0 && (
        <>
          <h3>{t('ebooks')}</h3>
          {ebookGroups.map((group, idx) => {
            const sellerObj = group.seller;
            const sellerName =
              typeof sellerObj === 'object'
                ? sellerObj.username ||
                  `${sellerObj.firstName || ''} ${
                    sellerObj.lastName || ''
                  }`.trim() ||
                  'Seller'
                : 'Seller';

            return (
              <div key={idx} className='mb-4'>
                <div className='text-center fw-bold fs-5 mb-2'>
                  {t('sellerLabel')}:{' '}
                  <Link to={`/sellers/${getSellerId(group.seller)}`}>
                    {sellerName}
                  </Link>
                </div>
                <ul className='list-group mb-2'>
                  {group.items.map((it) => (
                    <li
                      key={it._id}
                      className='list-group-item position-relative'
                    >
                      <div>
                        <div>{it.title}</div>
                        <small>{money(it.unitPriceMinor)} EUR</small>
                      </div>
                      <button
                        className='btn btn-sm btn-outline-danger position-absolute end-0 me-1 top-50 translate-middle-y'
                        style={{ width: '100px' }}
                        onClick={() => remove(it._id)}
                      >
                        {t('remove')}
                      </button>
                    </li>
                  ))}
                </ul>
                <PayWithEthereum token={token} navigate={navigate}>
                  {t('checkoutEbooks')}
                </PayWithEthereum>
              </div>
            );
          })}
          <div className='alert alert-info mt-2'>{t('ebookInfo')}</div>
        </>
      )}
    </div>
  );
}
