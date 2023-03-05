import {useContext, useCallback, useState, useEffect} from "react";
import { useCookies } from 'react-cookie';
import { useTranslation } from '../hooks/useTranslation';

import Button from "./elements/button";
import AuthContext from '../context/auth-context'

import Login from "./login/login";
import Modal from "./elements/modal";

export default function CheckoutButton({data, handleOrder}) {
  const authFromContext = useContext(AuthContext);

  const [active, setActive] = useState(false);

  const { translate } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies();

  const handleChange = useCallback(() => {
    setActive(!active)
  }, [active]);

  useEffect(() => {
    if (!authFromContext.auth) return;
    if (authFromContext.auth.fromPage === 'checkout') {
      checkout(); 
    }
  }, [authFromContext.auth]);

  const checkout = async () => {
    const {auth} = authFromContext;
    const {totalLineItemsPrice, totalShippingPrice, totalDiscounts} = data;
    
    if (auth) {
      const total = +(totalLineItemsPrice+totalShippingPrice-totalDiscounts).toFixed(2);
      const order = await createOrderAPI({...data, totalPrice: total});
      if (order) {
        handleOrder(order.orderNumber);
        removeCookie('cart');
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
          <Login onClose={handleChange} fromPage={'checkout'} />
      </Modal>

      <Button onClick={checkout} primary size='large'>{translate('order')}</Button>
    </>
  )
}