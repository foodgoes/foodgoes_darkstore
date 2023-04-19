import {useState, useCallback, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import Link from 'next/link'
import {fetchUserAsync, updateUser} from './authSlice'
import styles from './auth.module.css';

import { signOut } from "firebase/auth";
import {firebaseAuth} from '@/src/common/utils/init-firebase';

import { useTranslation } from '@/src/common/hooks/useTranslation';
import Modal from '@/src/common/components/elements/modal';
import Login from '@/src/common/components/login/login'
import Button from '@/src/common/components/elements/button';
import AccountSVG from '@/public/icons/account';

function Auth() {
    const dispatch = useDispatch();
    const {user:auth} = useSelector(state => state.auth);
    const authStatus = useSelector(state => state.auth.status);
    
    const [accountMenu, setAccountMenu] = useState(false);
    const [active, setActive] = useState(false);
    const btnRef = useRef();
    const { translate } = useTranslation();
    const handleChange = useCallback(() => setActive(!active), [active]);

    useEffect(() => {
        if (authStatus === 'idle') {
            dispatch(fetchUserAsync());
        }
    }, [authStatus, dispatch]);
    
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

    if (auth) {
        return (
            <div className={styles.account}>
                <div ref={btnRef}>
                    <Button plain onClick={() => setAccountMenu(prev => !prev)}><AccountSVG /></Button>
                </div>
                {accountMenu && (
                    <div className={styles.accountMenu}>
                        <ul>
                            <li><Link href={'/history'}><Button plain fullWidth>{translate('menuOrders')}</Button></Link></li>
                            <li><Button plain fullWidth onClick={() => logout()}>{translate('logout')}</Button></li>
                        </ul>
                    </div>
                )}
            </div>
        );
    }

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
        
            <div className={styles.auth}>
                <Button onClick={handleChange}>{translate('login')}</Button>
            </div>
      </>
    );
};

export default Auth