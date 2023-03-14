import {useState, useEffect, useContext} from 'react'

import Link from 'next/link'
import Head from 'next/head'

import styles from '../styles/Cart.module.css'
import Button from '@/components/elements/button'
import ProductViewList from '@/components/product-view-list'

import CartContext from '@/context/cart-context'
import AuthContext from '@/context/auth-context'
import DiscountContext from '@/context/discount-context'

import { useTranslation } from '../hooks/useTranslation';

import TrashSVG from '../public/icons/trash'
import ArrowLeftSVG from '../public/icons/arrow-left'
import CheckoutButton from '@/components/checkout-button'

export default function Cart() {
  const cartFromContext = useContext(CartContext);
  const authFromContext = useContext(AuthContext);
  const {totalDiscounts} = useContext(DiscountContext);

  const [cartId, setCartId] = useState(null);
  const [products, setProducts] = useState([]);
  
  const { translate } = useTranslation();
  
  useEffect(() => {
    const getCartAPI = async () => {
      try {
        const res = await fetch('/api/front/cart', {headers: {'Content-Type': 'application/json'}});
        const cart = await res.json();

        if (cart) {
          setCartId(cart.id);
          setProducts(cart.productsV2);
        } else {
          setProducts([]);
        }
      } catch(e) {
        console.log(e);
      }
    }

    getCartAPI();
  }, [authFromContext.auth]);

  const totalShippingPrice = 25;
  const totalLineItemsPrice = cartFromContext.cart.total;

  const clearCart = async () => {
    await deleteCartAPI();
    cartFromContext.deleteCart();
  };

  const deleteCartAPI = async () => {
    const res = await fetch('/api/front/cart?id='+cartId, {method: 'DELETE',  headers: {'Content-Type': 'application/json'}});
    return await res.json();
  }
  
  if (!cartFromContext.cart.products.length) {
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
    </>
  )
}