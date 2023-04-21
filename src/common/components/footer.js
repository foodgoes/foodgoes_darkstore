import Link from 'next/link';
import LogoGraySVG from '@/public/icons/logo-gray';
import styles from '@/src/styles/Footer.module.css';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import FacebookSVG from '@/public/icons/facebook';
import InstagramSVG from '@/public/icons/instagram';

export default function Footer() {
  const {translate} = useTranslation();

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.top}>
          <Link href="/">
            <LogoGraySVG />
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
          <div className={styles.socialsWrapper}>
            <div className={styles.socials}>
              <a target="_blank" href="https://www.facebook.com/foodgoes.deli/" rel="noopener noreferrer">
                <FacebookSVG fill="#9e9b98" />
              </a>
              <a target="_blank" href="https://www.instagram.com/foodgoes.deli/" rel="noopener noreferrer">
                <InstagramSVG fill="#9e9b98" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}