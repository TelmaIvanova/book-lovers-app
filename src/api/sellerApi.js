export async function fetchSeller(sellerId) {
  const res = await fetch(`/api/sellers/${sellerId}`);
  if (!res.ok) throw new Error('Failed to load seller');
  return res.json();
}
