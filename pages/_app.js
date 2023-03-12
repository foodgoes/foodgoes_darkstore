import { useEffect, useState} from 'react';

import Layout from '@/components/layout'
import '@/styles/globals.css'
import AuthContext from '@/context/auth-context';
import LocationContext from '@/context/location-context';
import CartContext from '@/context/cart-context';
import DiscountContext from '@/context/discount-context';

function MyApp({ Component, pageProps }) {
  const [auth, setAuth] = useState(null);
  const [location, setLocation] = useState({address: null});
  const [cart, setCart] = useState({total:0, products:[]});
  const [discounts, setDiscounts] = useState({products: [], shipping: []});
  const [totalDiscounts, setTotalDiscounts] = useState(0);
  const [actionAfterLogin, setActionAfterLogin] = useState(null);
  const [productIdAfterLocation, setProductIdAfterLocation] = useState(null);

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

  const updateAddress = (address) => setLocation(prevState => ({...prevState, address}));
  const deleteCart = () => setCart({total:0, products:[]});
  const updateCart = (products, total) => setCart(prevState => ({...prevState, products, total}));
  const updateDiscounts = discounts => setDiscounts(discounts);
  const updateTotalDiscounts = totalDiscounts => setTotalDiscounts(totalDiscounts);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <main>
      <AuthContext.Provider value={{auth, setAuth, actionAfterLogin, setActionAfterLogin}}>
        <LocationContext.Provider value={{location, updateAddress, productIdAfterLocation, setProductIdAfterLocation}}>
          <CartContext.Provider value={{cart, updateCart, deleteCart}}>
            <DiscountContext.Provider value={{discounts, updateDiscounts, totalDiscounts, updateTotalDiscounts}}>
              <Layout>
                  {getLayout(<Component {...pageProps} />)}
              </Layout>
            </DiscountContext.Provider>
          </CartContext.Provider>
        </LocationContext.Provider>
      </AuthContext.Provider>
    </main>
  );
}

export default MyApp
