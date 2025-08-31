import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('orders');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load order');
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();

    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id, token]);

  if (loading) return <p>{t('loading')}</p>;
  if (!order) return <p>{t('notFound')}</p>;

  const money = (m) => (m / 100).toFixed(2);

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('orderId', { id: order._id })}</title>
      </Helmet>
      <h1>
        {t('orderId', { id: order._id })} – {t(`statusValues.${order.status}`)}
      </h1>

      <ul className='list-group mb-3'>
        {order.items.map((it, idx) => (
          <li key={idx} className='list-group-item'>
            <div>
              <strong>{it.productId?.title}</strong> (
              {t(`type.${it.productId?.type}`)})
            </div>
            <small>
              {money(it.unitPriceMinor)} × {it.quantity}— {t('seller')}:{' '}
              {it.seller?.firstName ||
                it.seller?.username ||
                it.seller?.ethereumAddress ||
                '—'}
            </small>
          </li>
        ))}
      </ul>

      <p>
        {t('payment')}: {t(`paymentMethods.${order.paymentInfo.method}`)} –{' '}
        {money(order.paymentInfo.amountMinor)}
      </p>
      {order.paymentInfo.txHash && (
        <p>
          {t('txHash')}:{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${order.paymentInfo.txHash}`}
            target='_blank'
            rel='noreferrer'
          >
            {order.paymentInfo.txHash}
          </a>
        </p>
      )}
      <small className='text-muted'>
        {t('createdAt')}: {new Date(order.createdAt).toLocaleString()}
      </small>
    </div>
  );
}
