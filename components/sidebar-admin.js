import Link from 'next/link';
import styles from '../styles/Sidebar.module.css'

export default function SidebarAdmin() {
    return (
        <div className={styles.sidebar}>
            <div>
                <h2>Admin</h2>
            </div>
            <ul className={styles.links}>
                <li>
                    <Link href='/admin/dashboard'><div>Dashboard</div></Link>
                </li>
                <li>
                    <Link href='/admin/orders'><div>Orders</div></Link>
                </li>
            </ul>
        </div>
    );
}