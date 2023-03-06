import {useContext, useCallback, useState, useEffect} from "react";
import {useRouter} from 'next/router'
import { useTranslation } from '../hooks/useTranslation';

import Button from "./elements/button";
import AuthContext from '../context/auth-context'

import Login from "./login/login";
import Modal from "./elements/modal";

import AlertOrderSuccess from "./alerts/order-success";

export default function CheckoutButton({data, clearCart}) {
  const authFromContext = useContext(AuthContext);

  const [active, setActive] = useState(false);
  const [activeAlert, setActiveAlert] = useState(false);
  const [orderNumber, setOrderNumber] = useState();

  const router = useRouter();

  const { translate } = useTranslation();

  const handleChangeAlert = useCallback(() => setActiveAlert(!activeAlert), [activeAlert]);
  const handleChange = useCallback(() => setActive(!active), [active]);

  useEffect(() => {
    if (!authFromContext.actionAfterLogin) return;

    if (authFromContext.actionAfterLogin === 'checkout') {
      checkout();
    }
  }, [authFromContext.actionAfterLogin]);

  const checkout = async () => {
    const {auth} = authFromContext;    
    if (auth) {
      const order = await createOrderAPI({...data});
      if (order) {
        setOrderNumber(order.orderNumber);
        handleChangeAlert();

        clearCart();

        authFromContext.setActionAfterLogin(null);
      }
    } else {
      handleChange();
    }
  };

  const createOrderAPI = async body => {
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

      <Modal
          open={activeAlert}
          onClose={handleChangeAlert}
          primaryAction={{
            onAction: () =>  router.push({pathname: '/account/orders'}, undefined, { locale: router.locale }), 
            content: translate('aboutOrder')
          }}
          secondaryActions={[{
            onAction: () =>  router.push({pathname: '/'}, undefined, { locale: router.locale }), 
            content: translate('btnInCatalog')
          }]}
        >
          <AlertOrderSuccess orderNumber={orderNumber} />
        </Modal>

      <Button onClick={checkout} primary size='large'>{translate('order')}</Button>
    </>
  )
}