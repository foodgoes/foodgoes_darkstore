import styles from '@/src/styles/Home.module.css'

import Sidebar from '@/src/common/components/sidebar'
import Catalog from '@/src/common/components/catalog';
import Banners from '@/src/common/components/banners';

export default function Home({categories, products}) {  
  return (
    <div className={styles.wrapper}>
      <Sidebar categories={categories} />

      <div className={styles.main}>
        <Banners />
        <Catalog products={products} />
      </div>
    </div>
  )
}

const getCategoriesAPI = async () => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/categories`);
  return await res.json();
};

const getProductsAPI = async () => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/products`);
  const {products} = await res.json();

  return products;
};

export async function getServerSideProps({ req, res }) {
  const categories = await getCategoriesAPI();
  const products = await getProductsAPI();

  return { props: { categories, products } };
}