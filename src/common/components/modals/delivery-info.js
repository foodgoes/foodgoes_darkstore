import { useTranslation } from '@/src/common/hooks/useTranslation';
import styles from '@/src/styles/DeliveryInfo.module.css';

export default function DeliveryInfo() {
    const { translate } = useTranslation();

    return (
        <div>
            <ul>
                <li>
                    <div className={styles.line}>
                        <span>{translate('schedule')}</span>
                        <span>{translate('scheduleWorkDays')}<br />8:00 - 20:00</span>
                    </div>
                </li>
                <li>
                    <div className={styles.line}>
                        <span>{translate('deliveryTime')}</span>
                        <span>1–3 {translate('hours')}</span>
                    </div>
                </li>
                <li>
                    <div className={styles.line}>
                        <span>{translate('delivery')}</span>
                        <span>&#8362;30</span>
                    </div>
                </li>
            </ul>
        </div> 
    )
}