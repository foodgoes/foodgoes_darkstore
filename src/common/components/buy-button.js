import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';

import styles from '@/src/styles/BuyButton.module.css'

import MinusSVG from '@/public/icons/minus'
import PlusSVG from '@/public/icons/plus'
import MinusSmallSVG from '@/public/icons/minus-small'
import PlusSmallSVG from '@/public/icons/plus-small'

import { useTranslation } from '@/src/common/hooks/useTranslation';
import Button from '@/src/common/components/elements/button';
import Modal from "@/src/common/components/elements/modal";
import Address from "@/src/common/components/modals/address";

import { logProductIdBeforelocation, logProductIdAfterlocation, selectProductIdBeforelocation ,selectProductIdAfterlocation } from '@/src/features/location/locationSlice';
import { updateCartAsync, checkDiscountCartAsync } from '@/src/features/cart/cartSlice';

export default function BuyButton({disabled, productId, primary=false, secondary=false, size="medium"}) {
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

        buy(productId);
    }, [productIdAfterlocation, dispatch]);

    const buy = async (productId, action='inc') => {
        try {
            if (!productId) {
                throw 'Invalid productId';
            }

            if (!location) {
                dispatch(logProductIdBeforelocation(productId));
                handleChangeAddress();
                return;
            }

            dispatch(checkDiscountCartAsync());
            dispatch(updateCartAsync({productId, action}));

            if (productIdBeforelocation) {
                dispatch(logProductIdBeforelocation(null));
                dispatch(logProductIdAfterlocation(null));
            }
        } catch(e) {
            return;
        }
    };

    const handleClose = () => {
        handleChangeAddress();
        dispatch(logProductIdBeforelocation(null));
    };

    let content = (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Button onClick={() => buy(productId)} size={size}
                disabled={disabled} secondary={secondary} primary={primary} fullWidth><span>{translate('buy')}</span></Button>
            </div>
        </div>
    );

    const productInCart = cart?.products.find(p => p.productId === productId);
    if (productInCart) {
        content = (
            <div className={styles.wrapper}>
                <div className={styles.container + (size ? ' ' + styles[size] : '')}>
                    <Button onClick={() => buy(productId, 'dec')} secondary>
                        {size !== 'small' ? <MinusSVG /> : <MinusSmallSVG />}</Button>
                    <span className={styles.quantity}>{productInCart.quantity}</span>
                    <Button onClick={() => buy(productId)} secondary>
                        {size !== 'small' ? <PlusSVG /> : <PlusSmallSVG />}
                    </Button>
                </div>
            </div>
        );
    }

    if (disabled) {
       content = (
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

            {content}
        </>
    );
}