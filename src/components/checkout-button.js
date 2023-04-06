import {useContext, useCallback, useState, useEffect} from "react";
import {useRouter} from 'next/router'
import { useTranslation } from '@/src/hooks/useTranslation';

import Button from "./elements/button";
import AuthContext from '@/src/context/auth-context'

import Login from "./login/login";
import Modal from "./elements/modal";

import styles from '@/src/styles/CheckoutButton.module.css';

export default function CheckoutButton({clearCart, totalPrice}) {
  const authFromContext = useContext(AuthContext);

  const [active, setActive] = useState(false);

  const router = useRouter();
  const { translate } = useTranslation();

  const handleChange = useCallback(() => setActive(!active), [active]);

  const minTotalPrice = 50;

  useEffect(() => {
    if (!authFromContext.actionAfterLogin) return;

    if (authFromContext.actionAfterLogin === 'checkout') {
      checkout();
    }
  }, [authFromContext.actionAfterLogin]);

  const checkout = async () => {
    try {
      const {auth, setActionAfterLogin, actionAfterLogin} = authFromContext;
      
      if (!auth) {
        handleChange();
        return;
      }
    
      const order = await createOrderAPI(actionAfterLogin);
      if (!order) {
        throw('Error create order.')
      }

      clearCart();
      setActionAfterLogin(null);
      router.push({pathname: '/orders/'+order.orderNumber}, undefined, { locale: router.locale });
    } catch(e) {
      console.log(e);
    }
  };

  const createOrderAPI = async (actionAfterLogin=null, body={}) => {
    body.guestLogged = actionAfterLogin === 'checkout';
    const res = await fetch('/api/front/orders', {method: 'POST',  headers: {
        'Content-Type': 'application/json',
        }, body: JSON.stringify(body)});

    return await res.json();
  };

  return (
    <>
      <Modal
          open={active}
          onClose={handleChange}
          title={translate('loginTitle')}
      >
          <Login onClose={handleChange} actionAfterLogin='checkout' />
      </Modal>

      <div className={styles.minTotalPrice}>
        <span>{translate('minTotalPrice')} &#8362;50</span>
      </div>

      <Button disabled={totalPrice < minTotalPrice} onClick={checkout} primary size='large'>{translate('order')}</Button>
    </>
  )
}