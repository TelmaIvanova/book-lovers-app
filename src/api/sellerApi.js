export async function fetchSeller(bookId) {
  const res = await fetch(`/api/books/${bookId}/seller`);
  if (!res.ok) throw new Error('Failed to load seller');
  return res.json();
}
