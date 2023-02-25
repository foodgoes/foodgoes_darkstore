import Layout from '../components/layout'

import '../styles/globals.css'

import { useEffect, useState} from 'react';
import localFont from 'next/font/local';

import {firebaseAuth, firebaseDB} from '../utils/init-firebase';

import { onAuthStateChanged } from "firebase/auth";
import { query, collection, where, getDocs } from "firebase/firestore";

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
    onAuthStateChanged(firebaseAuth, user => {
      setAuth(!!user);

      if (user && !cart) {
        fetchCart(user.uid);
      }
    });
  }, []);

  const fetchCart = async userId => {
    try {
      const querySnapshot = await getDocs((query(collection(firebaseDB, "cart"), where("userId", "==", userId))));
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setCart({
          id: doc.id,
          ...doc.data()
        });
      }
    } catch(e) {
      console.log(e);
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
