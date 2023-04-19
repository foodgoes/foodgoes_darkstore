import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import {useForm} from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import styles from '@/src/styles/Check.module.css';
import Total from '@/src/common/components/total';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import ArrowLeftSVG from '@/public/icons/arrow-left';
import Button from '@/src/common/components/elements/button';
import { withSessionSsr } from '@/src/common/lib/withSession';
import PaymentMethod from '@/src/common/components/payment-method';
import DeliveryAddress from '@/src/common/components/delivery-address';
import { deleteCart } from '@/src/features/cart/cartSlice';

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

export default function Check() {
  const router = useRouter();
  const {location} = useSelector(state => state.location); 
  const { register, handleSubmit, reset } = useForm();
  const { translate } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location || !location.address) {
      return;
    }

    reset({shippingAddress: location.address})
  }, [location]);

  const onSubmit = async data => {
    try {
      const {order} = await createOrderAPI(data);
      if (!order) {
        throw('Error create order.');
      }

      dispatch(deleteCart());

      router.push({pathname: '/check/success', query: {orderId: order.id}}, undefined, { locale: router.locale });
    } catch (e) {
      console.log(e);
    }
  };

  const createOrderAPI = async (body={}) => {
    const res = await fetch('/api/front/orders', {method: 'POST',  headers: {
        'Content-Type': 'application/json',
        }, body: JSON.stringify(body)});

    return await res.json();
  };

  return (
    <>
      <Head>
        <title>{translate('metaTitleCheckout')}</title>
      </Head>
      <div className={styles.wrapper}>
        <div className='topBar'>
          <div className='breadcrumbs'>
            <Link href="/cart"><ArrowLeftSVG stroke='#9e9b98' /> {translate('btnBackToCart')}</Link>
          </div>
          <div className='infoBlock'>
            <div>
              <h1 className='heading'>{translate('checkoutTitlePage')}</h1>
            </div>
          </div>
        </div>
        <div>
        <form>
            <div className={styles.container}>
              <div className={styles.wrapperDelivery}>
                <div className={styles.methods}><PaymentMethod /></div>
                <div className={styles.methods}><DeliveryAddress register={register} /></div>
              </div>
              <div className={styles.wrapperTotals}>
                <Total />
                <Button onClick={handleSubmit(onSubmit)} primary size='large'>{translate('order')}</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}