import styles from '@/styles/OrderDone.module.css'
import { useTranslation } from '@/hooks/useTranslation';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Button from '@/components/elements/button';

export default function OrderDone() {
  const router = useRouter()
  const { translate } = useTranslation();

  const { orderNumber } = router.query;

  return (
    <div>
      <div className={styles.top}>
          <span className={styles.hooray}></span>
      </div>
      <p className={styles.text}>{translate('orderTitle')} #{orderNumber}</p>
      <div className={styles.buttons}>
        <Link href={'/account/orders'} className={styles.aboutOrder}><Button primary={true}>{translate('aboutOrder')}</Button></Link>
        <Link href={'/'}><Button>{translate('btnInCatalog')}</Button></Link>
      </div>
    </div> 
  )
}