import {useContext, useCallback, useState, useEffect} from "react";
import {useRouter} from 'next/router'
import { useTranslation } from '../hooks/useTranslation';

import Button from "./elements/button";
import AuthContext from '../context/auth-context'

import Login from "./login/login";
import Modal from "./elements/modal";

export default function CheckoutButton({clearCart}) {
  const authFromContext = useContext(AuthContext);

  const [active, setActive] = useState(false);

  const router = useRouter();
  const { translate } = useTranslation();

  const handleChange = useCallback(() => setActive(!active), [active]);

  useEffect(() => {
    if (!authFromContext.actionAfterLogin) return;

    if (authFromContext.actionAfterLogin === 'checkout') {
      checkout();
    }
  }, [authFromContext.actionAfterLogin]);

  const checkout = async () => {
    const {auth, setActionAfterLogin, actionAfterLogin} = authFromContext;    
    if (auth) {
      const order = await createOrderAPI(actionAfterLogin);
      if (order) {
        clearCart();
        setActionAfterLogin(null);

        router.push({pathname: '/orders/'+order.orderNumber}, undefined, { locale: router.locale });
      }
    } else {
      handleChange();
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
          <Login onClose={handleChange} actionAfterLogin={'checkout'} />
      </Modal>

      <Button onClick={checkout} primary size='large'>{translate('order')}</Button>
    </>
  )
}