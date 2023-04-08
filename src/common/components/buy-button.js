import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';

import styles from '@/src/styles/BuyButton.module.css'

import MinusSVG from '@/public/icons/minus'
import PlusSVG from '@/public/icons/plus'
import MinusSmallSVG from '@/public/icons/minus-small'
import PlusSmallSVG from '@/public/icons/plus-small'

import { useTranslation } from '@/src/common/hooks/useTranslation';

import Button from './elements/button';
import Modal from "./elements/modal";
import Address from "./modals/address";

import { logProductIdBeforelocation, logProductIdAfterlocation, selectProductIdBeforelocation ,selectProductIdAfterlocation } from '@/src/features/location/locationSlice';
import { updateCart } from '@/src/features/cart/cartSlice';

export default function BuyButton({disabled, productId, price, primary=false, secondary=false, size="medium"}) {
    const [activeAddress, setActiveAddress] = useState(false);
    const dispatch = useDispatch();
    const productIdBeforelocation = useSelector(selectProductIdBeforelocation);
    const productIdAfterlocation = useSelector(selectProductIdAfterlocation);
    const {location} = useSelector(state => state.location);
    const {cart} = useSelector(state => state.cart);
    
    const { translate } = useTranslation();

    const handleChangeAddress = useCallback(() => setActiveAddress(!activeAddress), [activeAddress]);

    useEffect(() => {
        if (productIdAfterlocation !== productId) return;

        buy(productId, price);
    }, [productIdAfterlocation, dispatch]);

    const buy = async (productId, price=0, action='inc') => {
        try {
            if (!productId) {
                throw 'Invalid productId';
            }

            if (!location) {
                dispatch(logProductIdBeforelocation(productId));
                handleChangeAddress();
                return;
            }

            const total = (function(total, price, action) {
                if (action === 'inc') total = total + price;
                if (action === 'dec') total = total - price;
                return +(total.toFixed(2));
            })(cart.total, price, action);

            const products = (function(products, productId, action) {
                const product = products.find(p => p.productId === productId);

                if (!product) {
                    return products.concat({productId, quantity: 1});
                }

                const quantity = (function(quantity, action) {
                    if (action === 'inc') return quantity + 1;
                    if (action === 'dec') return quantity - 1;
                    return quantity;
                })(product.quantity, action);

                if (quantity < 1) {
                    return products.filter(p => p.productId !== productId);
                }

                return products.map(p => ({
                    ...p,
                    quantity: p.productId === productId ? quantity : p.quantity
                }));
            })(cart.products, productId, action);

            const updatedCart = await updateCartAPI(products, total);
            dispatch(updateCart(updatedCart));

            if (productIdBeforelocation) {
                dispatch(logProductIdBeforelocation(null));
                dispatch(logProductIdAfterlocation(null));
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

    const handleClose = () => {
        handleChangeAddress();
        dispatch(logProductIdBeforelocation(null));
    };

    const productInCart = cart?.products.find(p => p.productId === productId);
    if (productInCart) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.container + (size ? ' ' + styles[size] : '')}>
                    <Button onClick={() => buy(productId, price, 'dec')} secondary>
                        {size !== 'small' ? <MinusSVG /> : <MinusSmallSVG />}</Button>
                    <span className={styles.quantity}>{productInCart.quantity}</span>
                    <Button onClick={() => buy(productId, price)} secondary>
                        {size !== 'small' ? <PlusSVG /> : <PlusSmallSVG />}
                    </Button>
                </div>
            </div>
        );
    }

    if (disabled) {
       return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Button size={size} disabled={disabled} secondary={secondary} fullWidth><span>{translate('notAvailable')}</span></Button>
            </div>
        </div>
       );
    }

    return (
        <>
            {activeAddress && createPortal(
                <Modal
                    open={activeAddress}
                    onClose={handleClose}
                    title={translate('enterYourDeliveryAddress')}
                >
                    <Address onClose={handleClose} />
                </Modal>,
                document.body
            )}

            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <Button onClick={() => buy(productId, price)} size={size}
                    disabled={disabled} secondary={secondary} primary={primary} fullWidth><span>{translate('buy')}</span></Button>
                </div>
            </div>
        </>
    );
}