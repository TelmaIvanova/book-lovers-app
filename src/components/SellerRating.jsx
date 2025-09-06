import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiBase from '../config/api';

const SellerRating = ({ sellerId, token }) => {
  const { t } = useTranslation('seller');
  const [rating, setRating] = useState(0);
  const [votesCount, setVotesCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [hoverValue, setHoverValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const isGuest = !token;

  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch(`${apiBase}/sellers/${sellerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch seller');
        const data = await res.json();
        const seller = data.seller;
        setRating(seller.rating || 0);
        setVotesCount(seller.votesCount || 0);
        setHasVoted(seller.hasVoted || false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeller();
  }, [sellerId, token]);

  const handleRate = async (value) => {
    if (hasVoted) return;

    try {
      const res = await fetch(`${apiBase}/sellers/${sellerId}/rate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newVote: value }),
      });
      if (!res.ok) throw new Error('Failed to rate seller');
      const data = await res.json();
      const seller = data.seller;
      setRating(seller.rating || 0);
      setVotesCount(
        (seller.r1 || 0) +
          (seller.r2 || 0) +
          (seller.r3 || 0) +
          (seller.r4 || 0) +
          (seller.r5 || 0)
      );
      setHasVoted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>{t('loading')}</p>;

  return (
    <div style={{ margin: '1rem 0', textAlign: 'center' }}>
      {votesCount === 0 ? (
        <div>{t('empty')}</div>
      ) : (
        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          {rating} / 5 ({votesCount} {t('votes')})
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4px',
          cursor: hasVoted || isGuest ? 'default' : 'pointer',
        }}
      >
        {stars.map((star) => (
          <span
            key={star}
            onMouseEnter={() => !hasVoted && !isGuest && setHoverValue(star)}
            onMouseLeave={() => !hasVoted && !isGuest && setHoverValue(0)}
            onClick={() => !isGuest && handleRate(star)}
            style={{
              fontSize: '1.5rem',
              color: (hoverValue || rating) >= star ? '#FFD700' : '#CCC',
              pointerEvents: hasVoted || isGuest ? 'none' : 'auto',
              transition: 'color 0.2s ease',
            }}
          >
            ★
          </span>
        ))}
      </div>

      {hasVoted && (
        <p style={{ marginTop: '0.5rem', color: 'green' }}>{t('thanks')}</p>
      )}
    </div>
  );
};

export default SellerRating;
