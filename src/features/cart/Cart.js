import { useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import styles from './cart.module.css';
import Button from '@/src/components/elements/button';
import { useTranslation } from '@/src/hooks/useTranslation';
import CartSVG from '@/public/icons/cart';
import {fetchCartAsync} from './cartSlice';

function Cart() {
    const dispatch = useDispatch();
    const {cart} = useSelector(state => state.cart);
    const cartStatus = useSelector(state => state.cart.status);

    const { translate } = useTranslation();

    useEffect(() => {
        if (cartStatus === 'idle') {
            console.log('--cart')
            dispatch(fetchCartAsync());
        }
    }, [cartStatus, dispatch]);

    if (cartStatus === 'loading') return (<><span>Cart Loading...</span></>);

    return (
        <div className={styles.cart}>
            <Link className={styles.cartButton} href="/cart">
              <Button primary={!!cart?.total}><CartSVG />{cart?.total ? '\u20AA' + cart.total.toFixed(2) : translate('cart')}</Button>
            </Link>
        </div>
    );
}

export default Cart;