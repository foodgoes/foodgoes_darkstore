import { useState, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/src/styles/DeliveryButtonHeader.module.css';
import Button from '@/src/components/elements/button';
import NavigationSVG from '@/public/icons/navigation';
import { useTranslation } from '@/src/hooks/useTranslation';
import Address from '@/src/components/modals/address';
import LocationContext from '@/src/context/location-context';
import Modal from '@/src/components/elements/modal';

export default function DeliveryAddressHeader() {
    const [activeAddress, setActiveAddress] = useState(false);
    const handleChangeAddress = useCallback(() => setActiveAddress(!activeAddress), [activeAddress]);

    const {location} = useContext(LocationContext);
    const { translate } = useTranslation();

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

            <div className={styles.delivery}>
                <div className={styles.addressButton}>
                    <Button primary={!location.address} onClick={handleChangeAddress}>
                        <NavigationSVG /> <span className={styles.text}>{location.address?.address1 || translate('enterDeliveryAddress')}</span>
                    </Button>
                </div>
                <div className={styles.deliveryInfo}>
                    <div className={styles.deliveryTime}>1–3 {translate('hours')}</div>
                    <div className={styles.deliveryPrice}>{translate('delivery')} &#8362;30</div>
                </div>
            </div>
        </>
    );
}