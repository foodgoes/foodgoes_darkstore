import { useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from 'react-dom';

import styles from '@/styles/BuyButton.module.css'

import MinusSVG from '@/public/icons/minus'
import PlusSVG from '@/public/icons/plus'
import MinusSmallSVG from '@/public/icons/minus-small'
import PlusSmallSVG from '@/public/icons/plus-small'

import CartContext from '@/context/cart-context';
import LocationContext from "@/context/location-context";
import { useTranslation } from '@/hooks/useTranslation';

import Button from './elements/button';
import Modal from "./elements/modal";
import Address from "./modals/address";

export default function BuyButton({disabled, productId, price, primary=false, secondary=false, size="medium"}) {
    const [activeAddress, setActiveAddress] = useState(false);

    const cartFromContext = useContext(CartContext);
    const locationFromContext = useContext(LocationContext);
    
    const { translate } = useTranslation();

    const handleChangeAddress = useCallback(() => setActiveAddress(!activeAddress), [activeAddress]);

    useEffect(() => {
        if (locationFromContext.productIdAfterLocation !== productId) return;

        buy(productId, price);
      }, [locationFromContext.productIdAfterLocation]);

    const buy = async (productId, price=0, action='inc') => {
        try {
            if (!productId) {
                throw 'Invalid productId';
            }

            const {location, setProductIdAfterLocation} = locationFromContext;
            const {cart, updateCart} = cartFromContext;

            if (!location.address) {
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

            updateCart(products, total);
            await updateCartAPI(products, total);

            setProductIdAfterLocation(null);
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

    return (
        <>
            {activeAddress && createPortal(
                <Modal
                    open={activeAddress}
                    onClose={handleChangeAddress}
                    title={translate('enterYourDeliveryAddress')}
                >
                    <Address onClose={handleChangeAddress} productIdAfterLocation={productId} />
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