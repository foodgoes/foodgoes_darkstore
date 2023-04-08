import {useCallback, useState, useEffect} from "react";
import {useRouter} from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import { callEventBeforeLogin, callEventAfterLogin, selectCallingEventAfterLogin } from '@/src/features/auth/authSlice';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import Login from "@/src/components/login/login";
import Modal from "@/src/components/elements/modal";
import Button from "@/src/components/elements/button";
import styles from '@/src/styles/CheckoutButton.module.css';

export default function CheckoutButton({clearCart, totalPrice}) {
  const dispatch = useDispatch();
  const callingEventAfterLogin = useSelector(selectCallingEventAfterLogin);
  const {user: auth} = useSelector(state => state.auth);

  const [active, setActive] = useState(false);

  const router = useRouter();
  const { translate } = useTranslation();

  const handleChange = useCallback(() => setActive(!active), [active]);

  const minTotalPrice = 50;

  useEffect(() => {
    if (!callingEventAfterLogin) return;

    if (callingEventAfterLogin === 'checkout') {
      checkout();
    }
  }, [callingEventAfterLogin, dispatch]);

  const checkout = async () => {
    try {
      if (!auth) {
        dispatch(callEventBeforeLogin('checkout'));
        handleChange();
        return;
      }

      const order = await createOrderAPI(callingEventAfterLogin);
      if (!order) {
        throw('Error create order.')
      }

      clearCart();
      dispatch(callEventBeforeLogin(null));
      dispatch(callEventAfterLogin(null));

      router.push({pathname: '/orders/'+order.orderNumber}, undefined, { locale: router.locale });
    } catch(e) {
      console.log(e);
    }
  };

  const createOrderAPI = async (actionAfterLogin=null, body={}) => {
    body.guestLogged = !!actionAfterLogin;
    const res = await fetch('/api/front/orders', {method: 'POST',  headers: {
        'Content-Type': 'application/json',
        }, body: JSON.stringify(body)});

    return await res.json();
  };

  const handleClose = () => {
    handleChange();
    dispatch(callEventBeforeLogin(null));
  };

  return (
    <>
      <Modal
          open={active}
          onClose={handleClose}
          title={translate('loginTitle')}
      >
          <Login onClose={handleClose} />
      </Modal>

      <div className={styles.minTotalPrice}>
        <span>{translate('minTotalPrice')} &#8362;50</span>
      </div>

      <Button disabled={totalPrice < minTotalPrice} onClick={checkout} primary size='large'>{translate('order')}</Button>
    </>
  )
}