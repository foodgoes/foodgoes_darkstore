import { useContext, useEffect } from "react";

import {firebaseAuth} from '../utils/init-firebase';

import styles from '../styles/BuyButton.module.css'

import MinusSVG from '../public/icons/minus'
import PlusSVG from '../public/icons/plus'

import MinusSmallSVG from '../public/icons/minus-small'
import PlusSmallSVG from '../public/icons/plus-small'

import CartContext from '../context/cart-context'
import { useTranslation } from '../hooks/useTranslation';

import Button from './elements/button'

export default function BuyButton({disabled, productId, price, primary=false, secondary=false, size="medium"}) {
    const cartFromContext = useContext(CartContext);
    const { translate } = useTranslation();

    useEffect(() => {
        if (!cartFromContext || !cartFromContext.cart) return;
    }, [cartFromContext]);
    
    const buy = async (productId, price=0) => {
        try {
            const user = firebaseAuth.currentUser;
            
            if (user) {
                const userId = user.uid;    
    
                const {cart, createCart, updateProductsCart, updateTotalCart} = cartFromContext;
                if (cart) {
                    const product = cart.products.find(p => p.productId === productId);
                    if (!product) {
                        const total = +(cart.total+price).toFixed(2);
                        const products = cart.products.concat({productId, quantity: 1});

                        await updateCartAPI(cart.id, total, products);

                        updateProductsCart(products);
                        updateTotalCart(total);
                    }
                } else {
                    const total = price;
                    const products = [{productId, quantity: 1}];
                    const cart = await createCartAPI(userId, total, products);
                    if (cart) {
                        createCart({id: cart.id, userId, products, total});
                    }
                }
            } else {
                console.log('Чтобы добавить товар в корзину авторизуйтесь')
            }
        } catch(e) {
            console.log(e);
            return;
        }
    };

    const counter = async (productId, price, action=null) => {
        try {
            const user = firebaseAuth.currentUser;
            if (user) {
                const {cart, updateProductsCart, updateTotalCart} = cartFromContext;
                if (!cart) {
                    throw 'Invalid Cart';
                }

                const product = cart.products.find(p => p.productId === productId);
                if (!product) {
                    throw 'Invalid Cart';
                }

                let quantity = product.quantity;
                if (action === 'inc') {
                    quantity += 1;
                } else {
                    quantity -= 1;
                }

                if (quantity < 1) {
                    cart.products = cart.products.filter(p => p.productId !== productId);
                } else {
                    cart.products = cart.products.map(p => {
                        return {
                            ...p,
                            quantity: p.productId === productId ? quantity: p.quantity
                        };
                    });
                }

                cart.total = cart.total + (action ? price : -price);
                cart.total = +cart.total.toFixed(2);
                
                await updateCartAPI(cart.id, cart.total, cart.products);

                updateProductsCart(cart.products);
                updateTotalCart(cart.total);
            } else {
                console.log('Чтобы добавить товар в корзину авторизуйтесь')
            }
        } catch(e) {
            console.log(e);
            return;
        }
    };

    const getProductCartById = productId => {
        const {cart} = cartFromContext;

        return cart?.products.find(p => p.productId === productId) ?? null;
    };
    const inCart = getProductCartById(productId);

    const createCartAPI = async (userId, total, products) => {
        const body = {userId, total, products};
        const res = await fetch('/api/front/cart', {method: 'POST',  headers: {
            'Content-Type': 'application/json',
            }, body: JSON.stringify(body)});

        return await res.json();
    };
    const updateCartAPI = async (cartId, total, products) => {
        const body = {cartId, total, products};
        const res = await fetch('/api/front/cart', {method: 'PUT',  headers: {
            'Content-Type': 'application/json',
            }, body: JSON.stringify(body)});

        return await res.json();
    };

    return (
        <div className={styles.wrapper}>
            {inCart && (
                <div className={styles.container + (size ? ' ' + styles[size] : '')}>
                    <Button onClick={() => counter(productId, price)} secondary>
                        {size !== 'small' ? <MinusSVG /> : <MinusSmallSVG />}</Button>
                    <span className={styles.quantity}>{inCart.quantity}</span>
                    <Button onClick={() => counter(productId, price, 'inc')} secondary>
                        {size !== 'small' ? <PlusSVG /> : <PlusSmallSVG />}
                    </Button>
                </div>
            )}
            {inCart === null && (
                (
                    <div className={styles.container}>
                        <Button onClick={() => buy(productId, price)} size={size}
                        disabled={disabled} secondary={secondary} primary={primary} fullWidth><span>{translate('buy')}</span></Button>
                    </div>
                )
            )}
        </div>
    );
}