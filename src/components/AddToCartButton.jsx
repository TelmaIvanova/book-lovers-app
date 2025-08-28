import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import { useTranslation } from 'react-i18next';

function AddToCartButton({ book }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const nav = useNavigate();
  const loc = useLocation();
  const toast = useToast();
  const { t } = useTranslation(['shoppingCart']);

  const onAdd = async () => {
    if (!isAuthenticated) {
      nav(
        `/login?redirect=${encodeURIComponent(loc.pathname)}&intent=add:${
          book._id
        }`
      );
      return;
    }
    try {
      const res = await addItem({
        productId: book._id,
        title: book.title,
        unitPriceMinor: Math.round(
          Number(book?.price?.amount ?? book?.price) * 100
        ),
      });
      if (res?.alreadyInCart) {
        toast.info(t('alreadyAddedMessage'));
      } else if (res?.added) {
        toast.success(t('addedToCartMessage'));
      }
    } catch {
      toast.error(t('errorAddingItem'));
    }
  };

  return (
    <button className='btn btn-primary' onClick={onAdd}>
      {t('addToCartButton')}
    </button>
  );
}
export default AddToCartButton;
