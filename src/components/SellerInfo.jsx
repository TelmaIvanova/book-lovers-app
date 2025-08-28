import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGetSeller } from '../api/sellerApi';

export default function SellerInfo({ sellerId, mode = 'inline' }) {
  const [seller, setSeller] = useState(null);

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
      : seller.username || seller.ethAddress;

  if (mode === 'inline') {
    return <Link to={`/profile/${seller._id}`}>{displayName}</Link>;
  }

  if (mode === 'full') {
    return (
      <div>
        <h2>{displayName}</h2>
        {seller.contact && <p>Contact: {seller.contact}</p>}
        <p>Books offered: {seller.booksCount ?? 0}</p>
      </div>
    );
  }

  return null;
}
