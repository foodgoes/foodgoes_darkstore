import {useState, useCallback, useEffect, useRef, useContext} from 'react'
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { signOut } from "firebase/auth";

import { useTranslation } from '@/hooks/useTranslation';
import AuthContext from '@/context/auth-context';
import Modal from '@/components/elements/modal';
import Login from '@/components/login/login'
import Button from '@/components/elements/button';
import AccountSVG from '@/public/icons/account';
import styles from '@/styles/AccountHeader.module.css';

export default function AccountHeader() {
    const [accountMenu, setAccountMenu] = useState(false);
    const [active, setActive] = useState(false);
    const {auth, setAuth} = useContext(AuthContext);
    const btnRef = useRef();
    const { translate } = useTranslation();
    const handleChange = useCallback(() => setActive(!active), [active]);

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
          {active && createPortal(
            <Modal
                open={active}
                onClose={handleChange}
                title={translate('loginTitle')}
            >
                <Login onClose={handleChange} />
            </Modal>,
            document.body
          )}

          {!auth && (
            <div className={styles.auth}>
              <Button onClick={handleChange}>{translate('login')}</Button>
            </div>
          )}
        
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
        </>
    );
}