import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import styles from '@/src/styles/Cart.module.css';
import Button from '@/src/common/components/elements/button';
import Modal from '@/src/common/components/elements/modal';
import ProductViewList from '@/src/common/components/product-view-list';
import Total from '@/src/common/components/total';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import { deleteCart } from '@/src/features/cart/cartSlice';
import TrashSVG from '@/public/icons/trash';
import ArrowLeftSVG from '@/public/icons/arrow-left';
import Login from '@/src/common/components/login/login';

import { callEventBeforeLogin, callEventAfterLogin, selectCallingEventAfterLogin } from '@/src/features/auth/authSlice';

export default function Cart() {
  const [active, setActive] = useState(false);
  const [activeLogin, setActiveLogin] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);
  const handleChangeLogin = useCallback(() => setActiveLogin(!activeLogin), [activeLogin]);
  
  const {cart} = useSelector(state => state.cart);
  const {user: auth} = useSelector(state => state.auth);
  const callingEventAfterLogin = useSelector(selectCallingEventAfterLogin);

  const router = useRouter();
  const { translate } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!callingEventAfterLogin) return;

    if (callingEventAfterLogin === 'checkout') {
      goToPayment();
    }
  }, [callingEventAfterLogin, dispatch]);

  const clearCart = async () => {
    await deleteCartAPI();
    dispatch(deleteCart());
  };
  const deleteCartAPI = async () => {
    const res = await fetch('/api/front/cart?id=' + cart.id, {method: 'DELETE',  headers: {'Content-Type': 'application/json'}});
    return await res.json();
  }

  const goToPayment = () => {
    try {
      if (!auth) {
        dispatch(callEventBeforeLogin('checkout'));
        handleChangeLogin();
        return;
      }

      dispatch(callEventBeforeLogin(null));
      dispatch(callEventAfterLogin(null));

      router.push({pathname: '/check'}, undefined, { locale: router.locale });
    } catch(e) {
      console.log(e);
    }
  };

  if (!cart.products.length) {
    return (
      <>
        <Head>
          <title>{translate('metaTitleCart')}</title>
        </Head>
        <div className={styles.wrapper}>
          <div className='topBar'>
            <div className='infoBlock'>
              <div>
                <h1 className='heading'>{translate('cartTitlePage')}</h1>
              </div>
            </div>
          </div>
          <div className={styles.containerEmpty}>
            <h2>{translate('cartTitle')}</h2>
            <p>{translate('cartTextEmpty')}</p>
            <Link href='/'><Button primary>{translate('btnInCatalog')}</Button></Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{translate('metaTitleCart')}</title>
      </Head>

      {active && createPortal(
        <Modal
            open={active}
            onClose={handleChange}
            title={translate("modalTitleEmptyCart")}
            primaryAction={{
              onAction: clearCart,
              content: translate("modalPrimaryBtnEmptyCart")
            }}
            secondaryActions={[{
              onAction: handleChange,
              content: translate("modalSecondaryBtnEmptyCart")
            }]}
        >
            <p>{translate("modalTextEmptyCart")}</p>
        </Modal>,
        document.body
      )}
      {activeLogin && createPortal(
        <Modal
            open={activeLogin}
            onClose={handleChangeLogin}
            title={translate('loginTitle')}
        >
            <Login onClose={handleChangeLogin} />
        </Modal>,
        document.body
      )}

      <div className={styles.wrapper}>
        <div className='topBar'>
          <div className='breadcrumbs'>
            <Link href="/"><ArrowLeftSVG stroke='#9e9b98' /> {translate('btnBackToCatalog')}</Link>
          </div>
          <div className='infoBlock'>
            <div>
              <h1 className='heading'>{translate('cartTitlePage')}</h1>
            </div>
            <div className={styles.btnClearCart}>
              <Button onClick={handleChange} size='small'><TrashSVG />{translate('btnClearCart')}</Button>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div>
            <ul className={styles.products}>
              {cart.productsV2.map(p => <li key={p.id}><ProductViewList product={p}/></li>)}
            </ul>
          </div>
          <div className={styles.wrapperTotals}>
            <Total />
            <Button primary size='large' onClick={goToPayment}>{translate('goToPayment')}</Button>
          </div>
        </div>
      </div>
    </>
  )
}