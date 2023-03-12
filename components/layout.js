import { useEffect, useContext } from 'react'
import Head from 'next/head'

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

import styles from '@/styles/Layout.module.css'

import CartContext from '@/context/cart-context'
import AuthContext from '@/context/auth-context'
import LocationContext from '@/context/location-context'
import DiscountContext from '@/context/discount-context'

export default function Layout({ children }) {
  const authFromContext = useContext(AuthContext);
  const locationFromContext = useContext(LocationContext);
  const cartFromContext = useContext(CartContext);
  const discountFromContext = useContext(DiscountContext);

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
    const getDiscounts = async () => {
      try {
        const {products, shipping} = await getDiscountsAPI();
        const {totalDiscounts} = await computeDiscountAPI();

        discountFromContext.updateDiscounts({products, shipping});
        discountFromContext.updateTotalDiscounts(totalDiscounts);
      } catch(e) {
        return null;
      }
    };

    getLocation();
    getCart();
    getDiscounts();
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
  const getDiscountsAPI = async () => {
    try {
      const res = await fetch('/api/front/discounts', {headers: {'Content-Type': 'application/json',}});
      return await res.json();
    } catch(e) {
      return null;
    }
  };
  const computeDiscountAPI = async () => {
    const res = await fetch('/api/front/compute-discount', {method: 'GET',  headers: {
        'Content-Type': 'application/json'
        }});

    return await res.json();
  };

  return (  
    <>
      <Head>
        <title>FoodGoes</title>
        <meta name="description" content="FoodGoes - food delivery." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <div className={styles.container}>
        {children}
        <Footer />
      </div>
    </>
  )
}