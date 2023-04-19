import {useState, useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from '@/src/common/hooks/useTranslation';
import styles from '@/src/styles/History.module.css'
import OrderViewCard from '@/src/common/components/order-view-card';
import ArrowLeftSVG from '@/public/icons/arrow-left';
import { withSessionSsr } from '@/src/common/lib/withSession';

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
      const user = req.session.user;
  
      if (!user) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };  
      }
  
      return {
        props: {}
      };
    },
);

export default function History() {
    const [orders, setOrders] = useState([]);
    const {translate} = useTranslation();  

    useEffect(() => {
        async function getOrdersAPI() {
          try {
            const res = await fetch('/api/front/orders');
            const orders = await res.json();
      
            setOrders(orders);
          } catch(e) {
            console.log(e);
          }
        }
    
        getOrdersAPI();
    }, []);

    return (
        <>
            <Head>
                <title>{translate('metaTitleOrders')}</title>
            </Head>
            <div className={styles.wrapper}>
                <div className='topBar'>
                    <div className='breadcrumbs'>
                        <Link href="/"><ArrowLeftSVG stroke='#9e9b98' /> {translate('btnBackToCatalog')}</Link>
                    </div>
                    <div className='infoBlock'>
                        <div><h1 className='heading'>{translate('ordersTitlePage')}</h1></div>
                    </div>
                </div>
                <div className={styles.container}>
                    <ul>
                        {orders.map(order => <li key={order.id} className={styles.order}><OrderViewCard order={order}/></li>)}
                    </ul>
                </div>
            </div>
        </>
    );
}