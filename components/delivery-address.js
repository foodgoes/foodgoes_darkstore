import styles from '@/styles/DeliveryButton.module.css';
import Button from '@/components/elements/button';
import NavigationSVG from '@/public/icons/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function DeliveryAddress({location, handleChangeAddress}) {
    const { translate } = useTranslation();

    return (
        <div className={styles.addressButton}>
            <Button primary={!location.address} onClick={handleChangeAddress}>
                <NavigationSVG /> <span className={styles.text}>{location.address?.address1 || translate('enterDeliveryAddress')}</span></Button>
        </div>
    );
}