import Head from 'next/head'
import styles from '@/src/styles/Admin.module.css'
import SidebarAdmin from './sidebar-admin'

function NestedLayoutAdmin({children}) {
    return (
        <>
            <Head>
                <title>FoodGoes - Admin</title>
            </Head>
            <div className={styles.wrapper}>
                <SidebarAdmin />
                <div className={styles.main}>{children}</div>
            </div>
        </>
    );
}

export default NestedLayoutAdmin;