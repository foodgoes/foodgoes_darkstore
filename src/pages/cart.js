import { useSelector, useDispatch } from 'react-redux';

import Link from 'next/link'
import Head from 'next/head'

import styles from '@/src/styles/Cart.module.css'
import Button from '@/src/common/components/elements/button'
import ProductViewList from '@/src/common/components/product-view-list'
import { useTranslation } from '@/src/common/hooks/useTranslation';

import TrashSVG from '@/public/icons/trash'
import ArrowLeftSVG from '@/public/icons/arrow-left'
import CheckoutButton from '@/src/common/components/checkout-button'

import { deleteCart } from '@/src/features/cart/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const {cart} = useSelector(state => state.cart);

  const { translate } = useTranslation();

  const totalDiscounts = 0;

  const totalShippingPrice = 30;
  const totalLineItemsPrice = cart.total;

  const clearCart = async () => {
    await deleteCartAPI();
    dispatch(deleteCart());
  };

  const deleteCartAPI = async () => {
    const res = await fetch('/api/front/cart?id=' + cart.id, {method: 'DELETE',  headers: {'Content-Type': 'application/json'}});
    return await res.json();
  }
  
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
              <Button onClick={() => clearCart()} size='small'><TrashSVG />{translate('btnClearCart')}</Button>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <ul className={styles.products}>
            {cart.productsV2.map(p => <li key={p.id}><ProductViewList product={p}/></li>)}
          </ul>
          <div className={styles.wrapperTotals}>
            <div className={styles.totals}>
              <div className={styles.top}>
                <h2 className={styles.subheading}>{translate('total')}</h2>
                <span className={styles.deliveryInfo}>{translate('shippingTime').replace('[time]', '3-5')}</span>
              </div>
              <table>
                <tbody>
                  <tr>
                    <th>{translate('products')}</th>
                    <td>&#8362;{totalLineItemsPrice}</td>
                  </tr>
                  {totalDiscounts > 0 && (
                    <tr>
                      <th>{translate('discount')}</th>
                      <td><span className={styles.totalDiscounts}>−&#8362;{totalDiscounts}</span></td>
                    </tr>
                  )}
                  <tr>
                    <th>{translate('shipping')}</th>
                    <td>&#8362;{totalShippingPrice}</td>
                  </tr>
                  <tr>
                    <th>{translate('payment')}</th>
                    <td>&#8362;{+(totalLineItemsPrice - totalDiscounts + totalShippingPrice).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <CheckoutButton clearCart={clearCart} totalPrice={+(totalLineItemsPrice - totalDiscounts + totalShippingPrice).toFixed(2)} />
          </div>
        </div>
      </div>
    </>
  )
}