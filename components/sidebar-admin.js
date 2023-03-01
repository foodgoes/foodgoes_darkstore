import styles from '../styles/Sidebar.module.css'

export default function SidebarAdmin() {
    return (
        <div className={styles.sidebar}>
            <div>
                <h2>Admin</h2>
            </div>
            <ul className={styles.links}>
                <li>
                    <div>Dashboard</div>
                </li>
                <li>
                    <div>Orders</div>
                </li>
            </ul>
        </div>
    );
}