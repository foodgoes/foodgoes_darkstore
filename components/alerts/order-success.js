import styles from '@/styles/Alert.module.css'
import { useTranslation } from '@/hooks/useTranslation';

export default function AlertOrderSuccess({orderNumber}) {
    const { translate } = useTranslation();

    return (
        <div>
            <div className={styles.top}>
                <span className={styles.hooray}></span>
            </div>
            <p className={styles.text}>{translate('orderTitle')} #{orderNumber}</p>
        </div> 
    )
}