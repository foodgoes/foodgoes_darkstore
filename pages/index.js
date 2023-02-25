import styles from '../styles/Home.module.css'

import Sidebar from '../components/sidebar'
import Catalog from '../components/catalog';

import OfferSVG from '../public/icons/offer'

import { useTranslation } from '../hooks/useTranslation';

export default function Home({categories, products}) {
  const { translate } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Sidebar categories={categories} />

      <div className={styles.main}>
        <div className={styles.alert}>
            <div className={styles.icon}><OfferSVG stroke='#ff5b37' width='48' height='48' /></div>
            <div className={styles.text}>{translate('alertDiscountFirstOrder').replace('[discount]', '30%')}</div>
        </div>  

        <Catalog products={products} />
      </div>
    </div>
  )
}

const getCategories = async () => {
  const res = await fetch(`${process.env.DOMAIN}/api/categories`);
  const categories = await res.json();

  return categories;
};

const getProducts = async () => {
  const res = await fetch(`${process.env.DOMAIN}/api/products`);
  const {products} = await res.json();

  return products;
};

export async function getServerSideProps() {
  const categories = await getCategories();
  const products = await getProducts();

  return { props: { categories, products } };
}