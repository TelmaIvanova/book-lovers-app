import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
const { ethers } = require('ethers');

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

  async function handlePayWithEth() {
    try {
      if (!window.ethereum) throw new Error('No wallet');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const from = await signer.getAddress();

      const prep = await fetch('/api/checkout/prepare', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      const amountWei = ethers.parseEther(prep.amountETH.toString());

      const net = await provider.getNetwork();
      if (net.chainId !== 11155111n) {
        throw new Error('Please switch to Sepolia network in MetaMask');
      }

      const tx = await signer.sendTransaction({
        to: prep.sellers[0].address,
        value: amountWei,
      });

      console.log('Transaction hash:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      const result = await fetch('/api/checkout/ebooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          txHash: tx.hash,
          amountETH: prep.amountETH,
          rateUsed: prep.rateUsed,
        }),
      }).then((r) => r.json());

      alert(`Ebook order ${result.status}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

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

  const approxTotal = [...physicalItems, ...ebookItems].reduce(
    (sum, it) => sum + it.unitPriceMinor,
    0
  );

  return (
    <div className='container mt-4'>
      <Helmet>
        <title>{t('title')}</title>
      </Helmet>
      <h1>{t('title')}</h1>

      <h3>{t('physical')}</h3>
      {!physicalItems.length && <p>{t('noPhysical')}</p>}
      <ul className='list-group mb-3'>
        {physicalItems.map((it) => (
          <li
            key={it._id}
            className='list-group-item d-flex justify-content-between align-items-center'
          >
            <div>
              <div>{it.title}</div>
              <small>{money(it.unitPriceMinor)} EUR</small>
            </div>
            <button
              className='btn btn-sm btn-outline-danger'
              onClick={() => remove(it._id)}
            >
              {t('remove')}
            </button>
          </li>
        ))}
      </ul>
      {physicalItems.length > 0 && (
        <button className='btn btn-primary mb-4' onClick={checkoutPhysical}>
          {t('checkoutPhysical')}
        </button>
      )}

      <h3>{t('ebooks')}</h3>
      {!ebookItems.length && <p>{t('noEbooks')}</p>}
      <ul className='list-group mb-3'>
        {ebookItems.map((it) => (
          <li
            key={it._id}
            className='list-group-item d-flex justify-content-between align-items-center'
          >
            <div>
              <div>{it.title}</div>
              <small>{money(it.unitPriceMinor)} EUR</small>
            </div>
            <button
              className='btn btn-sm btn-outline-danger'
              onClick={() => remove(it._id)}
            >
              {t('remove')}
            </button>
          </li>
        ))}
      </ul>
      {ebookItems.length > 0 && (
        <button
          className='btn btn-secondary mb-4'
          onClick={() => handlePayWithEth(token)}
        >
          {t('checkoutEbooks')}
        </button>
      )}

      <div className='d-flex justify-content-between align-items-center'>
        <strong>
          {t('total')}: {money(approxTotal)} EUR ({t('noDelivery')})
        </strong>
      </div>
    </div>
  );
}
