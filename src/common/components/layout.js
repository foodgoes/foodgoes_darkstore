import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Head from 'next/head';

import Navbar from '@/src/common/components/navbar';
import Footer from '@/src/common/components/footer';

import {fetchLocationAsync} from '@/src/features/location/locationSlice';
import {fetchCartAsync} from '@/src/features/cart/cartSlice';

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchLocationAsync());
    dispatch(fetchCartAsync());
  }, [user]);

  return (  
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      {children}
      <Footer />
    </>
  )
}