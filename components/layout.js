import Navbar from './navbar'
import Footer from './footer'
import Head from 'next/head'

import styles from '../styles/Layout.module.css'

import { useEffect, useContext } from 'react'

import CartContext from '../context/cart-context'
import AuthContext from '../context/auth-context'

export default function Layout({ children }) {
  const cartFromContext = useContext(CartContext);
  const authFromContext = useContext(AuthContext);

  useEffect(() => {
    const getCart = async () => {
      try {
        const cart = await getCartAPI();
        
        const products = cart ? cart.products : [];
        const total = cart ? cart.total : 0;

        cartFromContext.updateCart(products, total); 
      } catch(e) {
        return null;
      }
    };

    getCart();
  }, [authFromContext.auth]);

  const getCartAPI = async () => {
    try {
      const res = await fetch('/api/front/cart', {headers: {'Content-Type': 'application/json',}});
      return await res.json();
    } catch(e) {
      return null;
    }
  };

  return (  
    <>
      <Head>
        <title>FoodGoes</title>
        <meta name="description" content="FoodGoes - food delivery." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  )
}