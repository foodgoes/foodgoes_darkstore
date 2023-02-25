import styles from '../styles/Footer.module.css'
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} &nbsp; <Link href="/">FoodGoes</Link>
      </footer>
    </>
  )
}