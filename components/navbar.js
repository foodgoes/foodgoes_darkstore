import {useState, useCallback, useEffect, useRef, useContext} from 'react'

import { useRouter } from 'next/router';
import Link from 'next/link'

import styles from '../styles/Navbar.module.css'

import { useTranslation } from '../hooks/useTranslation';

import { signOut } from "firebase/auth";

import Modal from './elements/modal'
import Button from './elements/button'
import Login from './login/login'

import {firebaseAuth} from '../utils/init-firebase';
import AccountSVG from '../public/icons/account'
import CartSVG from '../public/icons/cart'
import GlobeSVG from '../public/icons/globe'
import LocalesList from './locales-list';

import CartContext from '@/context/cart-context'
import AuthContext from '@/context/auth-context';

export default function Navbar() {
  const [active, setActive] = useState(false);
  const [activeLocales, setActiveLocales] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  const btnRef = useRef();

  const router = useRouter();
  const { translate } = useTranslation();

  const {cart} = useContext(CartContext);
  const {auth, setAuth} = useContext(AuthContext);

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

  const queue = [];
  const handleKeyUpSearch = event => {
    try {
      queue.forEach(element => clearTimeout(element));

      const timeoutId = setTimeout(async () => {
        let q = event.target.value;
        q = q.trim().toLowerCase();

        if (q === '') {
          return;
        }
        if (q.length < 3) {
          return;
        }
        if (q.length > 25) {
          return;
        }

        const pathname = '/search';

        if (router.pathname !== pathname) {
          router.push({pathname, query: {text: q}}, undefined, { locale: router.locale });
        } else {
          router.replace({pathname, query: {text: q}}, undefined, { locale: router.locale });
        }
      }, 1500);

      queue.push(timeoutId);
    } catch(e) {
      return;
    }
  };

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

      <div className={styles.header}>
        <div>
            <Link className={styles.logo} href="/">FoodGoes</Link>
        </div>

        <div className={styles.search}>
          <input type="text" placeholder={translate('search')} onKeyUp={handleKeyUpSearch} />
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
          <input type="text" placeholder={translate('search')} onKeyUp={handleKeyUpSearch} />
        </div>
      </div>
    </>
  )
}