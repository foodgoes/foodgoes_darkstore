import {useState, useCallback, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { signOut } from "firebase/auth";
import {firebaseAuth} from '@/src/common/utils/init-firebase';

import { useTranslation } from '@/src/common/hooks/useTranslation';
import Modal from '@/src/common/components/elements/modal';
import Login from '@/src/common/components/login/login'
import Button from '@/src/common/components/elements/button';
import AccountSVG from '@/public/icons/account';
import styles from '@/src/styles/AccountHeader.module.css';

import { updateUser } from '@/src/features/auth/authSlice';

export default function AccountHeader() {
  const dispatch = useDispatch();
  const [accountMenu, setAccountMenu] = useState(false);
  const [active, setActive] = useState(false);
  const btnRef = useRef();
  const { translate } = useTranslation();
  const handleChange = useCallback(() => setActive(!active), [active]);

  const {user:auth} = useSelector(state => state.auth);

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
          dispatch(updateUser(null));
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