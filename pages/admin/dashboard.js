import {useRouter} from 'next/router'

import { withSessionSsr } from "../../lib/withSession";
import NestedLayoutAdmin from '../../components/nested-layout-admin'
import styles from '../../styles/Admin.module.css'

const Dashboard = () => {
  const { locale } = useRouter();

  return (
    <div>
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dashboard</h2>

            <div>Export/Import</div>
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