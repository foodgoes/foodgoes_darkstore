import Navbar from './navbar'
import Footer from './footer'
import Head from 'next/head'

import styles from '../styles/Layout.module.css'

export default function Layout({ children, isAuth }) {
  return (  
    <>
      <Head>
        <title>FoodGoes</title>
        <meta name="description" content="FoodGoes - food delivery." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <Navbar isAuth={isAuth} />
        {children}
        <Footer />
      </div>
    </>
  )
}