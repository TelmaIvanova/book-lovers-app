import apiBase from '../config/api';

export async function fetchSeller(sellerId) {
  const res = await fetch(`${apiBase}/sellers/${sellerId}`);
  if (!res.ok) throw new Error('Failed to load seller');
  return res.json();
}
