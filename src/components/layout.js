import Head from 'next/head'

import Navbar from '@/src/components/navbar'
import Footer from '@/src/components/footer'

export default function Layout({ children }) {
  return (  
    <>
      <Head>
        <title>FoodGoes</title>
        <meta name="description" content="FoodGoes - food delivery." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      {children}
      <Footer />
    </>
  )
}