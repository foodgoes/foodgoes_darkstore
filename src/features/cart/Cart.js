import Link from 'next/link';
import { useSelector } from 'react-redux';
import styles from './cart.module.css';
import Button from '@/src/common/components/elements/button';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import CartSVG from '@/public/icons/cart';

function Cart() {
    const {cart} = useSelector(state => state.cart);
    const cartStatus = useSelector(state => state.cart.status);

    const { translate } = useTranslation();

    let content;

    if (cartStatus === 'loading') {
        content = <span>Cart Loading...</span>;
    } else if (cartStatus === 'succeeded') {
        content = (
            <div className={styles.cart}>
                <Link className={styles.cartButton} href="/cart">
                    <Button primary={!!cart?.total}><CartSVG />{cart?.total ? '\u20AA' + cart.total.toFixed(2) : translate('cart')}</Button>
                </Link>
            </div>
        );
    }

    return content;
}

export default Cart;