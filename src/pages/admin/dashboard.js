import {useRouter} from 'next/router'

import { withSessionSsr } from '@/src/common/lib/withSession';
import NestedLayoutAdmin from '@/src/common/components/nested-layout-admin'
import styles from '@/src/styles/Admin.module.css'
import Button from '@/src/common/components/elements/button';

const Dashboard = () => {
  const { locale } = useRouter();

  const updateProducts = async () => {
    const body = {};
    const res = await fetch('/api/admin/products_from_xlsx', {method: 'PUT',  headers: {
        'Content-Type': 'application/json',
        }, body: JSON.stringify(body)});

    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dashboard</h2>

            <div>
              <h3>Export/Import</h3>
              <div>
                <p>Update products in DB from file (.xlsx)</p>
                <Button onClick={updateProducts}>Update</Button>
              </div>
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


export default Dashboard

Dashboard.getLayout = function getLayout(page) {
  return (
    <NestedLayoutAdmin>{page}</NestedLayoutAdmin>
  )
}