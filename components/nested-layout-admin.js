import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'

import styles from '../styles/Admin.module.css'

import {useTranslation} from '../hooks/useTranslation'
import SidebarAdmin from './sidebar-admin'

function NestedLayoutAdmin({children}) {
    const {locale} = useRouter();
    const { translate } = useTranslation();

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