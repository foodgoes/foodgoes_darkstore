import {useState, useEffect, useContext} from 'react'

import Link from 'next/link'
import Head from 'next/head'

import styles from '../styles/Cart.module.css'
import Button from '../components/button'
import ProductViewList from '../components/product-view-list'

import CartContext from '../context/cart-context'

import { useTranslation } from '../hooks/useTranslation';

import {firebaseAuth} from '../utils/init-firebase';

import TrashSVG from '../public/icons/trash'
import ArrowLeftSVG from '../public/icons/arrow-left'

export default function Cart() {
  const [products, setProducts] = useState(null);
  const [productsTotal, setProductsTotal] = useState(0);

  const cartFromContext = useContext(CartContext);
  
  const { translate } = useTranslation();
  
  const discountTotal = 0;
  const shippingTotal = 25;

  useEffect(() => {
    if (!cartFromContext || !cartFromContext.cart) {
      setProducts([]);
      return;
    };

    const user = firebaseAuth.currentUser;
    if (user) {
      const userId = user.uid;

      const getProductsCartAPI = async (userId) => {
        try {
          const res = await fetch('/api/front/cart?userId='+userId);
          const cart = await res.json();
    
          setProducts(cart.products);
          setProductsTotal(cart.total);
        } catch(e) {
          console.log(e);
        }
      }
      getProductsCartAPI(userId);
    }
  }, [cartFromContext]);

  const clearCart = async () => {
    const {cart: {id}, deleteCart} = cartFromContext;
    deleteCart();
    setProducts([]);

    await deleteCartAPI(id);
  };

  const checkout = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const userId = user.uid;

      const total = +(productsTotal+shippingTotal-discountTotal).toFixed(2);

      const order = await createOrderAPI(userId, {
        lineItems: products,
        financialStatus: 'pending',
        fulfillmentStatus: 'pending_fulfillment',
        totalShippingPrice: shippingTotal,
        totalTax: 0,
        totalLineItemsPrice: productsTotal, 
        totalDiscounts: discountTotal,
        subtotalPrice: productsTotal-discountTotal,
        totalPrice: total,
      });
      if (order) {
        clearCart();
      }
    } else {
      console.log('Авторизуйтесь, чтобы оформить заказ');
    }
  };


  const createOrderAPI = async (userId, data) => {
    const body = {userId, data};
    const res = await fetch('/api/front/orders', {method: 'POST',  headers: {
        'Content-Type': 'application/json',
        }, body: JSON.stringify(body)});

    return await res.json();
  };
  async function deleteCartAPI(cartId) {
    const res = await fetch('/api/front/cart?cartId='+cartId, {method: 'DELETE',  headers: {'Content-Type': 'application/json'}});
    return await res.json();
  } 


  if (!products) return;
  
  if (products.length === 0) {
    return (
      <>
        <Head>
          <title>{translate('metaTitleCart')}</title>
        </Head>
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
                  <td>&#8362; {productsTotal}</td>
                </tr>
                <tr>
                  <th>{translate('shipping')}</th>
                  <td>&#8362; {shippingTotal}</td>
                </tr>
                <tr>
                  <th>{translate('payment')}</th>
                  <td>&#8362; {+(productsTotal + shippingTotal).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button onClick={() => checkout()} primary size='large'>{translate('order')}</Button>
        </div>
      </div>
    </>
  )
}