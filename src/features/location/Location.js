import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import styles from './location.module.css';
import Button from '@/src/components/elements/button';
import NavigationSVG from '@/public/icons/navigation';
import { useTranslation } from '@/src/hooks/useTranslation';
import Address from '@/src/components/modals/address';
import Modal from '@/src/components/elements/modal';
import {fetchLocationAsync} from './locationSlice';

function Location() {
    const [activeAddress, setActiveAddress] = useState(false);
    const handleChangeAddress = useCallback(() => setActiveAddress(!activeAddress), [activeAddress]);

    const dispatch = useDispatch();
    const {location} = useSelector(state => state.location);
    const locationStatus = useSelector(state => state.location.status);

    const { translate } = useTranslation();

    useEffect(() => {
        if (locationStatus === 'idle') {
            console.log('-- location')
            dispatch(fetchLocationAsync());
        }
    }, [locationStatus, dispatch]);

    if (locationStatus === 'loading') return (<><span>Location Loading...</span></>);

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
        </>
    );
}

export default Location;