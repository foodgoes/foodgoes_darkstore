import Head from 'next/head'
import styles from '../../styles/Orders.module.css'
import Link from 'next/link'

import { useTranslation } from '../../hooks/useTranslation';

import {useState, useEffect} from 'react'

import {firebaseAuth} from '../../utils/init-firebase';

import Order from '../../components/order';

import ArrowLeftSVG from '../../public/icons/arrow-left'

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const {translate} = useTranslation();  

  useEffect(() => {
    async function getOrdersAPI() {
      try {
        const user = firebaseAuth.currentUser;

        if (!user) return;

        const res = await fetch(`/api/front/orders?userId=${user.uid}`);
        const orders = await res.json();
  
        setOrders(orders);
      } catch(e) {
        console.log(e);
      }
    }

    getOrdersAPI();
  }, [firebaseAuth.currentUser]);

  return (
    <>
      <Head>
        <title>FoodGoes - Orders</title>
      </Head>
      <div className='topBar'>
        <div className='breadcrumbs'>
          <Link href="/"><ArrowLeftSVG stroke='#9e9b98' /> {translate('btnBackToCatalog')}</Link>
        </div>
        <div className='infoBlock'>
          <div>
            <h1 className='heading'>{translate('ordersTitlePage')}</h1>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        {orders.map(order => (
          <div key={order.id}><Order order={order}/></div>
        ))}
      </div>
    </>
  )
}