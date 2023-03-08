import {useState, useCallback, useEffect, useRef, useContext} from 'react'
import Link from 'next/link'

import { signOut } from "firebase/auth";

import styles from '@/styles/Navbar.module.css'

import { useTranslation } from '@/hooks/useTranslation';

import AuthContext from '@/context/auth-context';
import CartContext from '@/context/cart-context';
import LocationContext from '@/context/location-context';

import Modal from '@/components/elements/modal'
import Button from '@/components/elements/button'
import Login from '@/components/login/login'
import LocalesList from '@/components/modals/locales-list';
import Address from '@/components/modals/address';
import Search from '@/components/search';
import DeliveryAddress from '@/components/delivery-address';

import {firebaseAuth} from '@/utils/init-firebase';

import AccountSVG from '@/public/icons/account'
import CartSVG from '@/public/icons/cart'
import GlobeSVG from '@/public/icons/globe'

export default function Navbar() {
  const [active, setActive] = useState(false);
  const [activeAddress, setActiveAddress] = useState(false);
  const [activeLocales, setActiveLocales] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  const btnRef = useRef();

  const { translate } = useTranslation();

  const {cart} = useContext(CartContext);
  const {auth, setAuth} = useContext(AuthContext);
  const {location} = useContext(LocationContext);
  
  const handleChangeAddress = useCallback(() => setActiveAddress(!activeAddress), [activeAddress]);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleChangeLocales = useCallback(() => setActiveLocales(!activeLocales), [activeLocales]);

  useEffect(() => {
    const closeDropDown = e => {
      if (!e.composedPath().includes(btnRef.current)) {
        setAccountMenu(false);
      }
    };

    document.body.addEventListener('click', closeDropDown);

    return () => document.body.removeEventListener('click', closeDropDown);
  }, []);

  const logout = () => {
      signOut(firebaseAuth).then(() => {
          fetch('/api/account/logout', {method: 'POST',  headers: {
            'Content-Type': 'application/json',
          }})
          .then((res) => res.json())
          .then((data) => {
            setAuth(null);
          });
      }).catch((error) => {
          // An error happened.
      });
  };

  return (
    <>
      <Modal
          open={activeLocales}
          onClose={handleChangeLocales}
          title={translate('modalLocalesTitle')}
      >
          <LocalesList onClose={handleChangeLocales} />
      </Modal>
      
      <Modal
          open={active}
          onClose={handleChange}
          title={translate('loginTitle')}
      >
          <Login onClose={handleChange} />
      </Modal>

      <Modal
          open={activeAddress}
          onClose={handleChangeAddress}
          title={translate('enterYourDeliveryAddress')}
      >
          <Address onClose={handleChangeAddress} />
      </Modal>

      <div className={styles.header}>
        <div>
            <Link className={styles.logo} href="/">FoodGoes</Link>
        </div>

        <div className={styles.search}>
          <Search/>
        </div>
        
        <div>
          <DeliveryAddress location={location} handleChangeAddress={handleChangeAddress} />
        </div>

        <div className={styles.buttons}>
          <div className={styles.cart}>
            <Link className={styles.cartButton} href="/cart">
              <Button primary={!!cart?.total}><CartSVG />{cart?.total ? '\u20AA' + cart.total : translate('cart')}</Button>
            </Link>
          </div>

          <div className={styles.globe}>
            <Button plain onClick={handleChangeLocales}><GlobeSVG /></Button>
          </div>

          {auth && (
            <div className={styles.account}>
              <div ref={btnRef}>
                <Button plain onClick={() => setAccountMenu(prev => !prev)}><AccountSVG /></Button>
              </div>
              {accountMenu && (
                <div className={styles.accountMenu}>
                  <ul>
                    <li><Link href={'/account/orders'}><Button plain fullWidth>{translate('menuOrders')}</Button></Link></li>
                    <li><Button plain fullWidth onClick={() => logout()}>{translate('logout')}</Button></li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <div>
            <div className={styles.auth}>
              {!auth && <Button onClick={handleChange}>{translate('login')}</Button>}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.headerMob}>
        <div className={styles.search + ' ' + styles.searchMob}>
          <Search />
        </div>
      </div>
    </>
  )
}