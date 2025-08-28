export async function apiGetCart(token) {
  const res = await fetch('/api/cart', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load cart');
  const data = await res.json();
  return {
    items: [...(data.physicalItems || []), ...(data.ebookItems || [])],
    physicalItems: data.physicalItems || [],
    ebookItems: data.ebookItems || [],
    subtotal: data.subtotal,
    shipping: data.shipping,
    total: data.total,
  }
}

export async function apiAddItem(token, payload) {
  const res = await fetch('/api/cart/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (res.status === 409) return { alreadyInCart: true };
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error('Failed to add item');
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return res.json();
}

export async function apiRemoveItem(token, itemId) {
  const res = await fetch(`/api/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove item');
  return res.json();
}

export async function apiCheckoutPhysical(token) {
  const res = await fetch('/api/checkout/physical', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed physical checkout');
  return res.json();
}

export async function apiCheckoutEbooks(token, txHash) {
  const res = await fetch('/api/checkout/ebooks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ txHash }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => 'Failed ebook checkout');
    throw new Error(msg);
  }
  return res.json();
}
