import Link from 'next/link'
import styles from '@/src/styles/Navbar.module.css';
import SearchHeader from '@/src/components/search-header';
import DeliveryAddressHeader from '@/src/components/delivery-address-header';
import CartHeader from '@/src/components/cart-header';
import LocaleSwitcherHeader from '@/src/components/locale-switcher-header';
import AccountHeader from './account-header';
import Catalogue from './catalogue';
import LogoSVG from '@/public/icons/logo';

export default function Navbar() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.logoMenu}>
          <Link className={styles.logo} href="/">
            <LogoSVG />
          </Link>
          <Catalogue />
        </div>

        <div className={styles.search}><SearchHeader /></div>
        <div className={styles.address}><DeliveryAddressHeader /></div>

        <div className={styles.buttons}>
          <div className={styles.cart}><CartHeader /></div>
          <LocaleSwitcherHeader />
          <AccountHeader />
        </div>
      </div>

      <div className={styles.headerMob}>
        <div className={styles.searchMob}><SearchHeader /></div>
        <div className={styles.addressMob}><DeliveryAddressHeader /></div>
      </div>

      <div className={styles.headerMobS}>
        <SearchHeader />
        <DeliveryAddressHeader />
        <CartHeader />
      </div>
    </>
  )
}