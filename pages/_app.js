import Layout from '../components/layout'

import '../styles/globals.css'

import { useEffect, useState} from 'react';
import localFont from 'next/font/local';

import CartContext from '../context/cart-context';
import AuthContext from '../context/auth-context';

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
  const [cart, setCart] = useState({total:0, products:[]});
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const getUserAPI = async () => {
      try {
        const res = await fetch('/api/front/user', {headers: {'Content-Type': 'application/json',}});
        const user = await res.json();

        setAuth(user);
      } catch(e) {
        return null;
      }
    };

    getUserAPI();
  }, []);

  const deleteCart = () => setCart({total:0, products:[]});
  const updateCart = (products, total) => setCart(prevState => ({...prevState, products, total}));

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <main className={roboto.className}>
      <AuthContext.Provider value={{auth, setAuth}}>
        <CartContext.Provider value={{cart, updateCart, deleteCart}}>
          <Layout>
              {getLayout(<Component {...pageProps} />)}
          </Layout>
        </CartContext.Provider>
      </AuthContext.Provider>
    </main>
  );
}

export default MyApp
