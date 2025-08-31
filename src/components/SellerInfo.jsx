import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiGetSeller } from '../api/sellerApi';

export default function SellerInfo({ sellerId, mode = 'inline' }) {
  const [seller, setSeller] = useState(null);
  const { t } = useTranslation('seller');

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetSeller(sellerId);
        setSeller(data.seller);
      } catch (err) {
        console.error(err);
      }
    }
    if (sellerId) load();
  }, [sellerId]);

  if (!seller) return null;

  const displayName =
    seller.firstName && seller.lastName
      ? `${seller.firstName} ${seller.lastName}`
      : seller.username || seller.ethereumAddress;

  if (mode === 'inline') {
    return <Link to={`/sellers/${seller._id}`}>{displayName}</Link>;
  }

  if (mode === 'full') {
    return (
      <div>
        <h2>{displayName}</h2>
        {seller.contact && (
          <p>
            {t('contact')}: {seller.contact}
          </p>
        )}
        <p>
          {t('booksOffered')}: {seller.booksCount ?? 0}
        </p>
        {seller.ethereumAddress && (
          <p>
            {t('ethereum')}: {seller.ethereumAddress}
          </p>
        )}
      </div>
    );
  }

  return null;
}
