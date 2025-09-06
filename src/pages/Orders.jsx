import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import apiBase from '../config/api';

export default function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('orders');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${apiBase}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load orders');
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  if (loading) {
    return <p>{t('loading')}</p>;
  }

  if (!orders.length) {
    return <p>{t('empty')}</p>;
  }

  const money = (m) => (m / 100).toFixed(2);

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('title')}</h1>
      {orders.map((order) => (
        <div key={order._id} className='card mb-3 shadow-sm'>
          <div className='card-body'>
            <h5 className='card-title'>
              {t('orderId', { id: order._id })} – {t(`type.${order.type}`)}
            </h5>
            <p>
              {t('status')}:{' '}
              <strong>{t(`statusValues.${order.status}`)}</strong>
            </p>
            <ul className='list-group mb-3'>
              {order.items.map((it, idx) => (
                <li key={idx} className='list-group-item'>
                  <div>
                    <strong>{it.productId?.title}</strong> (
                    {t(`type.${it.productId?.type}`)})
                  </div>
                  <small>
                    {money(it.unitPriceMinor)} EUR
                    <br></br>
                    {t('seller')}:{' '}
                    {it.seller?.firstName + ' ' + it.seller?.lastName ||
                      it.seller?.username ||
                      it.seller?.ethereumAddress ||
                      '—'}
                  </small>
                </li>
              ))}
            </ul>
            <p>
              {t('payment')}: {money(order.paymentInfo.amountMinor)} EUR →{' '}
              {t(`paymentMethods.${order.paymentInfo.method}`)}
            </p>
            {order.paymentInfo.txHash && (
              <p>
                {t('txHash')}: <code>{order.paymentInfo.txHash}</code>
              </p>
            )}
            <small className='text-muted'>
              {t('createdAt')}: {new Date(order.createdAt).toLocaleString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
