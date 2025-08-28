import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

export default function Checkout() {
  const { items, subtotal, shipping, total, checkout, isAuthenticated } =
    useCart();
  const nav = useNavigate();
  const { t } = useTranslation('checkout');

  const money = (m) => (m / 100).toFixed(2);

  if (!isAuthenticated) {
    nav('/login?redirect=/checkout');
    return null;
  }

  if (!items.length) {
    return (
      <div className='container mt-4'>
        <h1>{t('title')}</h1>
        <p>{t('emptyCart')}</p>
      </div>
    );
  }

  const place = async () => {
    const res = await checkout();
    nav(`/order-success?orderId=${encodeURIComponent(res.orderId)}`);
  };

  return (
    <div className='container mt-4'>
      <h1>{t('title')}</h1>
      <div className='mb-3'>
        <div>
          {t('subtotal')}: {money(subtotal)} EUR
        </div>
        <div>
          {t('shipping')}: {money(shipping)} EUR
        </div>
        <div className='fs-5 fw-bold'>
          {t('total')}: {money(total)} EUR
        </div>
      </div>
      <button className='btn btn-success' onClick={place}>
        {t('placeOrder')}
      </button>
    </div>
  );
}
