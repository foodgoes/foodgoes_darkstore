import Link from 'next/link';
import { useSelector } from 'react-redux';

import styles from './cart.module.css';
import Button from '@/src/common/components/elements/button';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import CartSVG from '@/public/icons/cart';
import SpinnerSVG from '@/public/icons/spinner';
import {financialStr} from '@/src/common/utils/utils';

function Cart() {
    const {cart} = useSelector(state => state.cart);
    const statusOfUpdate = useSelector(state => state.cart.statusOfUpdate);
    const { translate } = useTranslation();

    let content;

    if (statusOfUpdate === 'loading') {
        content = (
            <div className={styles.cartButton + ' ' + styles.cartButtonLoading}>
                <Button primary={true}><CartSVG /><SpinnerSVG /></Button>
            </div>
        );
    } else {
        content = (
            <Link className={styles.cartButton} href="/cart">
                <Button primary={!!cart?.totalPrice}><CartSVG />{cart?.totalPrice ? '\u20AA' + financialStr(cart.totalPrice) : translate('cart')}</Button>
            </Link>
        );
    }

    return (
        <div className={styles.cart}>
            {content}
        </div>
    );
}

export default Cart;