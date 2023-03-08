import { useEffect, useContext } from 'react'
import Head from 'next/head'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

import styles from '@/styles/Layout.module.css'

import CartContext from '@/context/cart-context'
import AuthContext from '@/context/auth-context'
import LocationContext from '@/context/location-context'

export default function Layout({ children }) {
  const authFromContext = useContext(AuthContext);
  const locationFromContext = useContext(LocationContext);
  const cartFromContext = useContext(CartContext);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getLocationAPI();

        locationFromContext.updateAddress(location.address); 
      } catch(e) {
        return null;
      }
    };
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

    getLocation();
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
  const getLocationAPI = async () => {
    try {
      const res = await fetch('/api/front/location', {headers: {'Content-Type': 'application/json',}});
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