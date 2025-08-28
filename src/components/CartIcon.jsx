import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartIcon() {
  const { items } = useCart();
  const count = items.length;

  return (
    <Link
      to='/cart'
      className='position-relative d-inline-flex align-items-center text-light me-3'
      aria-label='Cart'
      title='Cart'
      style={{ lineHeight: 0 }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='22'
        height='22'
        fill='currentColor'
        viewBox='0 0 16 16'
      >
        <path d='M0 1.5A.5.5 0 0 1 .5 1H2l.401 1.607L3.102 4H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 13H4a.5.5 0 0 1-.491-.408L2.01 4.607 1.61 3H.5a.5.5 0 0 1-.5-.5m4.415 3 .84 6.5H12.5l1.312-7H4.415z' />
        <path d='M5.5 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2m7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2' />
      </svg>

      {count > 0 && (
        <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
          {count}
        </span>
      )}
    </Link>
  );
}
