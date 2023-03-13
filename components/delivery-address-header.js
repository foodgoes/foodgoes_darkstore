import { useState, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/styles/DeliveryButtonHeader.module.css';
import Button from '@/components/elements/button';
import NavigationSVG from '@/public/icons/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import Address from '@/components/modals/address';
import LocationContext from '@/context/location-context';
import Modal from '@/components/elements/modal';

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

            <div className={styles.addressButton}>
                <Button primary={!location.address} onClick={handleChangeAddress}>
                    <NavigationSVG /> <span className={styles.text}>{location.address?.address1 || translate('enterDeliveryAddress')}</span>
                </Button>
            </div>
        </>
    );
}