import Head from 'next/head';
import { useTranslation } from '@/src/common/hooks/useTranslation';

import styles from '@/src/styles/Home.module.css'
import Sidebar from '@/src/common/components/sidebar'
import Catalog from '@/src/common/components/catalog';
import Banners from '@/src/common/components/banners';

export default function Home({categories, products}) {
  const {translate} = useTranslation();
  
  return (
    <>
      <Head>
        <title>{translate('metaTitleHome')}</title>
        <meta name="description" content={translate('metaDescriptionHome')} />
      </Head>
      <div className={styles.wrapper}>
        <Sidebar categories={categories} />

        <div className={styles.main}>
          <Banners />
          <Catalog products={products} />
        </div>
      </div>
    </>
  )
}

const getCategoriesAPI = async (headers) => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/categories`, {
    headers: {
      Cookie: headers.cookie
    }
  });
  return await res.json();
};

const getProductsAPI = async (headers) => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/products`, {
    headers: {
      Cookie: headers.cookie
    }
  });
  const {products} = await res.json();

  return products;
};

export async function getServerSideProps({ req, res }) {
  const categories = await getCategoriesAPI(req.headers);
  const products = await getProductsAPI(req.headers);

  return { props: { categories, products } };
}