import styles from '@/styles/Home.module.css'

import Sidebar from '@/components/sidebar'
import Catalog from '@/components/catalog';
import Discounts from '@/components/discounts';

export default function Home({categories, products}) {  
  return (
    <div className={styles.wrapper}>
      <Sidebar categories={categories} />

      <div className={styles.main}>
        <Discounts />
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

export async function getServerSideProps() {
  const categories = await getCategoriesAPI();
  const products = await getProductsAPI();

  return { props: { categories, products } };
}