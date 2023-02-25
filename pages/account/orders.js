import Head from 'next/head'
import styles from '../../styles/Orders.module.css'
import Link from 'next/link'

import { useTranslation } from '../../hooks/useTranslation';

import {useState, useEffect} from 'react'
import {collection, query, where, getDocs, orderBy, limit} from "firebase/firestore";

import {firebaseAuth, firebaseDB} from '../../utils/init-firebase';

import Order from '../../components/order';

import ArrowLeftSVG from '../../public/icons/arrow-left'

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const {translate} = useTranslation();  

  const statusDefinition = {
    cancelled: translate('cancelled'),
    pending: translate('pending'),
    completed: translate('completed')
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const user = firebaseAuth.currentUser;

        if (!user) return;

        const orders = [];

        const querySnapshot = await getDocs(query(collection(firebaseDB, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(25)));
        querySnapshot.forEach(doc => {
          const {createdAt, statusShipping, statusPayment} = doc.data();

          const date = new Date(+(createdAt.seconds+'000'));

          orders.push({
            id: doc.id,
            ...doc.data(),
            statusShipping: statusDefinition[statusShipping],
            statusPayment: statusDefinition[statusPayment],
            createdAt: date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
          });
        });
  
        setOrders(orders);
      } catch(e) {
        console.log(e);
      }
    }

    fetchOrders();
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