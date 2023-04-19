import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import styles from '@/src/styles/CheckSuccess.module.css';
import ArrowLeftSVG from '@/public/icons/arrow-left';
import { withSessionSsr } from '@/src/common/lib/withSession';
import LineItemViewList from '@/src/common/components/lineitem-view-list';

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

export default function Success() {
    const [order, setOrder] = useState();
    const {translate} = useTranslation();
    const router = useRouter()

    const { orderId, from } = router.query;

    useEffect(() => {
        async function getOrderAPI() {
          try {
            const res = await fetch('/api/front/orders/'+orderId);
            const {order} = await res.json();
      
            setOrder(order);
          } catch(e) {
            console.log(e);
          }
        }
    
        getOrderAPI();
    }, []);

    if (!order) {
      return <></>;
    }

    return (
        <>
            <Head>
                <title>{translate('metaTitleOrder')}</title>
            </Head>
            <div className={styles.wrapper}>
                <div className='topBar'>
                    <div className='breadcrumbs'>
                        {from === 'history' ? (
                            <Link href="/history"><ArrowLeftSVG stroke='#9e9b98' /> {translate('btnBackToMyOrders')}</Link>
                        ) : <Link href="/"><ArrowLeftSVG stroke='#9e9b98' /> {translate('btnBackToCatalog')}</Link>}
                    </div>
                    <div className='infoBlock'>
                        <div>
                          <h1 className='heading'>{translate('orderOn')} {order.date.day} {translate(order.date.monthCode)}</h1>
                          <div className={styles.shortInfo}>
                            <span>№ {order.orderNumber}</span>
                            <span> · </span>
                            <span>{translate('createdAt')} {order.date.hours}:{order.date.minuts}</span>
                            {order.canceledDate && (
                              <>
                                <span> · </span>
                                <span>{translate('canceledAt')} {order.canceledDate.hours}:{order.canceledDate.minuts}</span>
                              </>
                            )}
                          </div>
                        </div>
                    </div>
                </div>
                <div className={styles.container}>
                  <div className={styles.content}>
                    <section className={styles.lineItems}>
                      <div className={styles.subheading}><h2>{translate('yourOrder')}</h2></div>
                      <div>
                        {order.lineItems.map(lineItem => (
                          <div key={lineItem.id}>
                            <LineItemViewList lineItem={lineItem} />
                          </div>
                        ))}
                      </div>
                    </section>
                    <section className={styles.delivery}>
                      <div className={styles.subheading}><h2>{translate('deliveryDetails')}</h2></div>
                      <div className={styles.deliveryValues}>
                        <span className={styles.label}>{translate('address')}</span>
                        <span className={styles.labelValue}>{order.shippingAddress.address1}</span>
                      </div>
                    </section>
                  </div>
                  <aside className={styles.total}>
                    <div className={styles.subheading}><h2>{translate('total')}</h2></div>
                    <ul className={styles.totalUl}>
                      <li>
                        <span>{translate('products')}</span>
                        <span className={styles.ttlInt}>&#8362;{order.totalLineItemsPrice}</span>
                      </li>
                      <li>
                        <span>{translate('delivery')}</span>
                        <span className={styles.ttlInt}>&#8362;{order.totalShippingPrice}</span>
                      </li>
                    </ul>
                    <div className={styles.ttlPrice}>
                      <span>{translate('paid')}</span>
                      <span>&#8362;{order.totalPrice}</span>
                    </div>
                  </aside>
                </div>
            </div>
        </>
    )
}