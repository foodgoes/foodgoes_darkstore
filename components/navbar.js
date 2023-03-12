import Link from 'next/link'
import styles from '@/styles/Navbar.module.css';
import SearchHeader from '@/components/search-header';
import DeliveryAddressHeader from '@/components/delivery-address-header';
import CartHeader from '@/components/cart-header';
import LocaleSwitcherHeader from '@/components/locale-switcher-header';
import AccountHeader from './account-header';

export default function Navbar() {
  return (
    <>
      <div className={styles.header}>
        <div><Link className={styles.logo} href="/">FoodGoes</Link></div>
        <SearchHeader />
        <DeliveryAddressHeader />
        <CartHeader />
        <LocaleSwitcherHeader />
        <AccountHeader />
      </div>

      <div className={styles.headerMob}>
        <div className={styles.search + ' ' + styles.searchMob}>
          <SearchHeader />
        </div>
      </div>
    </>
  )
}