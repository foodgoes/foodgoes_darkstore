import {useState, useEffect, useContext} from 'react'

import Link from 'next/link'
import Head from 'next/head'

import styles from '../styles/Cart.module.css'
import Button from '../components/button'
import ProductViewList from '../components/product-view-list'

import CartContext from '../context/cart-context'

import { useTranslation } from '../hooks/useTranslation';

import {firebaseAuth, firebaseDB} from '../utils/init-firebase';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, serverTimestamp} from "firebase/firestore";

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
    const productIds = cartFromContext.cart?.products?.map(p => p.productId);

    async function fetchProducts(productIds) {
      try {
        const products = [];

        if (productIds && productIds.length > 0) {
          const querySnapshot = await getDocs(query(collection(firebaseDB, "products"), 
          where("__name__", "in", productIds), 
          where("enabled", "==", true)));
          querySnapshot.forEach((doc) => {
            products.push({
              id: doc.id,
              ...doc.data(),
              image: doc.data().images.length > 0 ? doc.data().images[0] : null,
              quantity: cartFromContext.cart.products.find(p => p.productId === doc.id).quantity,
            });
          });
        }
  
        setProducts(products);

        const productsTotal = products.reduce((acc, p) => {
          const price = p.discountPrice || p.price;
          acc += p.quantity * price;
          return acc;
        }, 0);
        setProductsTotal(productsTotal);
      } catch(e) {
        console.log(e);
      }
    }

    fetchProducts(productIds);
  }, [cartFromContext]);

  const clearCart = async () => {
    const {cart: {id}, deleteCart} = cartFromContext;
    await deleteDoc(doc(firebaseDB, "cart", id));
    deleteCart();
    setProducts([]);
  };

  const checkout = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const userId = user.uid;

      const total = productsTotal+shippingTotal-discountTotal;

      const docRef = await addDoc(collection(firebaseDB, "orders"), {
        userId, products, statusPayment: 'pending', statusShipping: 'pending', 
        shippingTotal, productsTotal, discountTotal, total,
        createdAt: serverTimestamp()
      });
      if (docRef.id) {
        clearCart();
      }
    } else {
      console.log('Авторизуйтесь, чтобы оформить заказ');
    }
  };

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
                  <td>&#8362; {productsTotal + shippingTotal}</td>
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