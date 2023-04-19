import {useState, useCallback, useEffect, useRef} from "react";
import { createPortal } from 'react-dom';
import styles from "@/src/styles/DeliveryAddress.module.css";
import Modal from '@/src/common/components/elements/modal';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import Address from '@/src/common/components/modals/address';

export default function DeliveryAddress({register}) {
    const [activeAddress, setActiveAddress] = useState(false);
    const handleChangeAddress = useCallback(() => setActiveAddress(!activeAddress), [activeAddress]);
    const inputBoxRef = useRef();
    const { translate } = useTranslation();

    useEffect(() => {
        inputBoxRef.current.addEventListener('click', handleChangeAddress);

        return () => {
            if (inputBoxRef.current) {
                inputBoxRef.current.removeEventListener('click', handleChangeAddress);
            }
        }
    }, [inputBoxRef]);

    return (
        <>
            {activeAddress && createPortal(
                <Modal
                    open={activeAddress}
                    onClose={handleChangeAddress}
                    title={translate('enterYourDeliveryAddress')}
                >
                    <Address onClose={handleChangeAddress} />
                </Modal>,
                document.body
            )}

            <div>
                <h2 className={styles.heading}>
                    <span>{translate('deliveryAddress')}</span>
                </h2>
                <div className={styles.location}>
                    <label className={styles.labelBox}>
                        <span>{translate('address1')}</span>
                        <div className={styles.inputBox + ' ' + styles.fullWidthBox} ref={inputBoxRef}>
                            <input type='input' {...register("shippingAddress.address1", { required: true })} />
                        </div>
                    </label>
                    <div className={styles.labelBoxRow}>
                        <label className={styles.labelBox}>
                            <span>{translate('address2')}</span>
                            <div className={styles.inputBox}>
                                <input type='input' {...register("shippingAddress.address2")} />
                            </div>
                        </label>
                        <label className={styles.labelBox}>
                            <span>{translate('entrance')}</span>
                            <div className={styles.inputBox}>
                                <input type='input' {...register("shippingAddress.entrance")} />
                            </div>
                        </label>
                        <label className={styles.labelBox}>
                            <span>{translate('floor')}</span>
                            <div className={styles.inputBox}>
                                <input type='input' {...register("shippingAddress.floor")} />
                            </div>
                        </label>
                        <label className={styles.labelBox}>
                            <span>{translate('doorCode')}</span>
                            <div className={styles.inputBox}>
                                <input type='input' {...register("shippingAddress.doorcode")} />
                            </div>
                        </label>
                    </div>
                    <label className={styles.labelBox}>
                        <span>{translate('instructionsForCourier')}</span>
                        <div className={styles.inputBox + ' ' + styles.fullWidthBox}>
                            <input type='input' {...register("shippingAddress.comment")} />
                        </div>
                    </label>
                </div>
            </div>
        </>
    );
}