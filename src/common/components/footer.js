import Link from 'next/link';
import LogoGraySVG from '@/public/icons/logo-gray';
import styles from '@/src/styles/Footer.module.css';
import { useTranslation } from '@/src/common/hooks/useTranslation';

export default function Footer() {
  const {translate} = useTranslation();

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.top}>
          <Link href="/">
            <LogoGraySVG fill="#9e9b98" />
          </Link>
        </div>
        <div className={styles.content}>
          <ul>
            <li>
              <Link href="/">
                <span>{translate('whatWeSell')}</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.bottom}>
          <div className={styles.info}>
            <span className={styles.infoAboutDelivery}>{translate('infoAboutDelivery')}</span>
            <span className={styles.links}>
              &copy; {new Date().getFullYear()} FoodGoes
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}