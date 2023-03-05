import { useContext } from "react";

import { useCookies } from 'react-cookie';
import styles from '../styles/BuyButton.module.css'

import MinusSVG from '../public/icons/minus'
import PlusSVG from '../public/icons/plus'
import MinusSmallSVG from '../public/icons/minus-small'
import PlusSmallSVG from '../public/icons/plus-small'

import CartContext from '../context/cart-context'
import AuthContext from '../context/auth-context'
import { useTranslation } from '../hooks/useTranslation';

import Button from './elements/button'

export default function BuyButton({disabled, productId, price, primary=false, secondary=false, size="medium"}) {
    const cartFromContext = useContext(CartContext);
    const authFromContext = useContext(AuthContext);
    const { translate } = useTranslation();
    const [cookies, setCookie] = useCookies();

    const buy = async (productId, price=0, action=null) => {
        try {
            if (!productId) {
                throw 'Invalid productId';
            }

            const {cart, updateCart} = cartFromContext;
            const {auth} = authFromContext;
            const {cart: cookieCart} = cookies;

            const product = cart.products.find(p => p.productId === productId);
            if (!product) {
                const total = +(cart.total+price).toFixed(2);
                const products = cart.products.concat({productId, quantity: 1});

                updateCart(products, total);
                const {token} = await updateCartAPI(products, total);
                if (!auth && !cookieCart) {
                    setCookie('cart', token, { path: '/', maxAge: 604800 });
                }
            } else {
                const quantity = action === 'inc' ? product.quantity + 1 : product.quantity - 1;

                const products = (function(products, productId, quantity) {
                    if (quantity < 1) {
                        return products.filter(p => p.productId !== productId);
                    } else {
                        return products.map(p => {
                            return {
                                ...p,
                                quantity: p.productId === productId ? quantity: p.quantity
                            };
                        });
                    }
                })(cart.products, productId, quantity);
    
                let total = cart.total + (action ? price : -price);
                total = +total.toFixed(2);
    
                updateCart(products, total);
                const {token} = await updateCartAPI(products, total);
                if (!auth && !cookieCart) {
                    setCookie('cart', token, { path: '/', maxAge: 604800 });
                }
            }
        } catch(e) {
            console.log(e);
            return;
        }
    };

    const updateCartAPI = async (products, total) => {
        const body = {total, products};
        const res = await fetch('/api/front/cart', {method: 'PUT',  headers: {
            'Content-Type': 'application/json',
            }, body: JSON.stringify(body)});

        return await res.json();
    };

    const productInCart = cartFromContext.cart.products.find(p => p.productId === productId);
    if (productInCart) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.container + (size ? ' ' + styles[size] : '')}>
                    <Button onClick={() => buy(productId, price)} secondary>
                        {size !== 'small' ? <MinusSVG /> : <MinusSmallSVG />}</Button>
                    <span className={styles.quantity}>{productInCart.quantity}</span>
                    <Button onClick={() => buy(productId, price, 'inc')} secondary>
                        {size !== 'small' ? <PlusSVG /> : <PlusSmallSVG />}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Button onClick={() => buy(productId, price)} size={size}
                disabled={disabled} secondary={secondary} primary={primary} fullWidth><span>{translate('buy')}</span></Button>
            </div>
        </div>
    );
}