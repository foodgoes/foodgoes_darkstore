import styles from "@/src/styles/PaymentMethod.module.css";
import { useTranslation } from '@/src/common/hooks/useTranslation';

export default function PaymentMethod() {
    const { translate } = useTranslation();

    return (
        <>
            <h2 className={styles.heading}>
                <span>{translate('paymentMethod')}</span>
            </h2>
            <div className={styles.payment}>
                <span>{translate('cashPayment')}</span>
            </div>
        </>
    );
}