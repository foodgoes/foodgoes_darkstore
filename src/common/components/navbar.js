import Link from 'next/link'
import styles from '@/src/styles/Navbar.module.css';
import SearchHeader from '@/src/common/components/search-header';
import LocaleSwitcherHeader from '@/src/common/components/locale-switcher-header';
import Catalogue from './catalogue';
import LogoSVG from '@/public/icons/logo';

import Account from "@/src/features/auth/Auth";
import Location from '@/src/features/location/Location';
import Cart from '@/src/features/cart/Cart';

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
        <div className={styles.address}><Location /></div>

        <div className={styles.buttons}>
          <div className={styles.cart}><Cart /></div>
          <LocaleSwitcherHeader />          
          <Account />
        </div>
      </div>

      <div className={styles.headerMob}>
        <div className={styles.searchMob}><SearchHeader /></div>
        <div className={styles.addressMob}><Location /></div>
      </div>

      <div className={styles.headerMobS}>
        <SearchHeader />
        <Location />
        <Cart />
      </div>
    </>
  )
}