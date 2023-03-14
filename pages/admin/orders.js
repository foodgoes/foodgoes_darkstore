import {useState, useEffect} from 'react'

import { withSessionSsr } from "@/lib/withSession";
import NestedLayoutAdmin from '@/components/nested-layout-admin'
import Order from '@/components/order';
import styles from '@/styles/Admin.module.css'

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getOrdersAPI() {
      try {
        const res = await fetch('/api/admin/orders');
        const orders = await res.json();
  
        setOrders(orders);
      } catch(e) {
        console.log(e);
      }
    }

    getOrdersAPI();
  }, []);

  return (
    <div>
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Orders</h2>

            <div>
            {orders.map(order => (
              <div key={order.id}><Order order={order}/></div>
            ))}
            </div>
        </div>
    </div>
  );
}

const getUserAPI = async (id, headers) => {
    const res = await fetch(`${process.env.DOMAIN}/api/front/user?id=${id}`, {headers});
    return await res.json();
  };


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

      const userData = await getUserAPI(user.id, req.headers);
      if (!userData.isAdmin) {
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


export default Orders

Orders.getLayout = function getLayout(page) {
  return (
    <NestedLayoutAdmin>{page}</NestedLayoutAdmin>
  )
}