import {useState, useEffect, useContext, useCallback} from 'react'
import {useRouter} from 'next/router'

import Link from 'next/link'
import Head from 'next/head'

import styles from '../styles/Cart.module.css'
import Button from '@/components/elements/button'
import Modal from '@/components/elements/modal'
import ProductViewList from '../components/product-view-list'

import CartContext from '../context/cart-context'
import AuthContext from '../context/auth-context'

import { useTranslation } from '../hooks/useTranslation';

import TrashSVG from '../public/icons/trash'
import ArrowLeftSVG from '../public/icons/arrow-left'
import AlertOrderSuccess from '@/components/alerts/order-success'
import CheckoutButton from '@/components/checkout-button'

export default function Cart() {
  const cartFromContext = useContext(CartContext);
  const authFromContext = useContext(AuthContext);

  const [cartId, setCartId] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(false);
  const [orderNumber, setOrderNumber] = useState();

  const router = useRouter();
  
  const { translate } = useTranslation();

  const handleChangeAlert = useCallback(() => setActiveAlert(!activeAlert), [activeAlert]);
  
  useEffect(() => {
    const getCartAPI = async () => {
      try {
        const res = await fetch('/api/front/cart', {headers: {'Content-Type': 'application/json',}});
        const cart = await res.json();

        setProducts(cart ? cart.productsV2 : []);
        if (cart) {
          setCartId(cart.id);
        }
      } catch(e) {
        console.log(e);
      }
    }

    getCartAPI();
  }, [authFromContext.auth]);

  const totalDiscounts = 0;
  const totalShippingPrice = 25;
  const totalLineItemsPrice = cartFromContext.cart.total;

  const clearCart = async () => {
    const {deleteCart} = cartFromContext;
    deleteCart();
    
    setProducts([]);
    await deleteCartAPI();
  };

  const deleteCartAPI = async () => {
    const res = await fetch('/api/front/cart?id='+cartId, {method: 'DELETE',  headers: {'Content-Type': 'application/json'}});
    return await res.json();
  }

  const handleOrder = orderNumber => {
    clearCart();
    setOrderNumber(orderNumber);
    handleChangeAlert();
  };
  
  if (!products.length) {
    return (
      <>
        <Head>
          <title>{translate('metaTitleCart')}</title>
        </Head>
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
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{translate('metaTitleCart')}</title>
      </Head>
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
          {products.map(p => <li key={p.id}><ProductViewList product={p}/></li>)}
        </ul>
        <div className={styles.wrapper}>
          <div className={styles.totals}>
            <div className={styles.top}>
              <h2 className={styles.subheading}>{translate('total')}</h2>
              <span className={styles.deliveryInfo}>{translate('shippingTime').replace('[time]', '25-45')}</span>
            </div>
            <table>
              <tbody>
                <tr>
                  <th>{translate('products')}</th>
                  <td>&#8362; {totalLineItemsPrice}</td>
                </tr>
                <tr>
                  <th>{translate('shipping')}</th>
                  <td>&#8362; {totalShippingPrice}</td>
                </tr>
                <tr>
                  <th>{translate('payment')}</th>
                  <td>&#8362; {+(totalLineItemsPrice + totalShippingPrice).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <CheckoutButton handleOrder={handleOrder} data={{
            lineItems: products,
            financialStatus: 'pending',
            fulfillmentStatus: 'pending_fulfillment',
            totalShippingPrice,
            totalTax: 0,
            totalLineItemsPrice, 
            totalDiscounts,
            subtotalPrice: totalLineItemsPrice-totalDiscounts,
            // totalPrice: total
        }}/>
        </div>
      </div>
    </>
  )
}