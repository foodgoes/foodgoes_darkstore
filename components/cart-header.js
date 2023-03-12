import { useContext } from 'react';
import Link from 'next/link'
import CartSVG from '@/public/icons/cart';
import { useTranslation } from '@/hooks/useTranslation';
import CartContext from '@/context/cart-context';
import styles from '@/styles/CartHeader.module.css';
import Button from '@/components/elements/button';

export default function CartHeader() {
    const {cart} = useContext(CartContext);
    const { translate } = useTranslation();

    return (
        <div className={styles.cart}>
            <Link className={styles.cartButton} href="/cart">
              <Button primary={!!cart?.total}><CartSVG />{cart?.total ? '\u20AA' + cart.total : translate('cart')}</Button>
            </Link>
        </div>
    );
}