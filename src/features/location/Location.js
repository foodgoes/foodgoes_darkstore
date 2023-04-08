import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import styles from './location.module.css';
import Button from '@/src/common/components/elements/button';
import NavigationSVG from '@/public/icons/navigation';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import Address from '@/src/common/components/modals/address';
import Modal from '@/src/common/components/elements/modal';

function Location() {
    const [activeAddress, setActiveAddress] = useState(false);
    const handleChangeAddress = useCallback(() => setActiveAddress(!activeAddress), [activeAddress]);

    const {location} = useSelector(state => state.location);
    const locationStatus = useSelector(state => state.location.status);

    const { translate } = useTranslation();

    let content;
    
    if (locationStatus === 'loading') {
        content = <span>Location Loading...</span>;
    } else if (locationStatus === 'succeeded') {
        content = (
            <div className={styles.delivery}>
                <div className={styles.addressButton}>
                    {!location ? (
                        <Button primary={false} onClick={handleChangeAddress}>
                            <NavigationSVG /> <span className={styles.text}>{translate('enterDeliveryAddress')}</span>
                        </Button> 
                    ) : (
                        <Button primary={true} onClick={handleChangeAddress}>
                            <NavigationSVG /> <span className={styles.text}>{location.address?.address1}</span>
                        </Button>
                    )}
                </div>
                <div className={styles.deliveryInfo}>
                    <div className={styles.deliveryTime}>1–3 {translate('hours')}</div>
                    <div className={styles.deliveryPrice}>{translate('delivery')} &#8362;30</div>
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
                    <Address onClose={handleChangeAddress} />
                </Modal>,
                document.body
            )}
            {content}
        </>
    );
}

export default Location;