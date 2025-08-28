import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  apiGetCart,
  apiAddItem,
  apiRemoveItem,
  apiCheckoutPhysical,
  apiCheckoutEbooks,
} from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [state, setState] = useState({
    items: [],
    physicalItems: [],
    ebookItems: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
    loading: false,
  });

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setState({
        items: [],
        physicalItems: [],
        ebookItems: [],
        subtotal: 0,
        shipping: 0,
        total: 0,
        loading: false,
      });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    try {
      const data = await apiGetCart(token);
      setState({
        items: data.items,
        physicalItems: data.physicalItems,
        ebookItems: data.ebookItems,
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
        loading: false,
      });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async ({ productId, title, unitPriceMinor }) => {
    if (!isAuthenticated) throw new Error('LOGIN_REQUIRED');
    const data = await apiAddItem(token, { productId, title, unitPriceMinor });
    if (data?.alreadyInCart) return { alreadyInCart: true };

    await refresh();
    return { added: true };
  };

  const remove = async (itemId) => {
    await apiRemoveItem(token, itemId);
    await refresh();
  };

  const value = {
    ...state,
    refresh,
    addItem,
    remove,
    checkoutPhysical: async () => {
      const res = await apiCheckoutPhysical(token);
      await refresh();
      return res;
    },
    checkoutEbooks: async (txHash) => {
      const res = await apiCheckoutEbooks(token, txHash);
      await refresh();
      return res;
    },
    isAuthenticated,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);
