import Head from 'next/head'

import Navbar from '@/src/common/components/navbar'
import Footer from '@/src/common/components/footer'

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