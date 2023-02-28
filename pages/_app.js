import Layout from '../components/layout'

import '../styles/globals.css'

import { useEffect, useState} from 'react';
import localFont from 'next/font/local';

import {firebaseAuth} from '../utils/init-firebase';
import { onAuthStateChanged } from "firebase/auth";

import CartContext from '../context/cart-context';

const roboto = localFont({
  src: [
    {
      path: '../fonts/roboto/Roboto-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/roboto/Roboto-Medium.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../fonts/roboto/Roboto-Bold.ttf',
      weight: '700',
      style: 'normal'
    }
  ],
  variable: '--roboto-font',
});

function MyApp({ Component, pageProps }) {
  const [isAuth, setAuth] = useState(null);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async user => {
      setAuth(!!user);

      if (user && !cart) {
        const cart = await getCartAPI(user.uid);
        setCart(cart);
      }
    });
  }, []);

  const getCartAPI = async userId => {
    try {
      const res = await fetch('/api/front/cart?userId='+userId, {headers: {'Content-Type': 'application/json',}});
      return await res.json();
    } catch(e) {
      return null;
    }
  };

  const createCart = cart => {
    setCart(cart);
  };
  const updateProductsCart = products => {
    setCart(prevState => ({
      ...prevState,
      products
    }));
  };
  const updateTotalCart = total => {
    setCart(prevState => ({
      ...prevState,
      total
    }));
  }
  const deleteCart = () => {
    setCart(null);
  };

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <main className={roboto.className}>
      <CartContext.Provider value={{cart, createCart, updateProductsCart, deleteCart, updateTotalCart}}>
        <Layout isAuth={isAuth}>
            {getLayout(<Component {...pageProps} />)}
        </Layout>
      </CartContext.Provider>
    </main>
  );
}

export default MyApp
