import NestedLayoutCategory from '../../components/nested-layout-category'
import Catalog from '../../components/catalog'

import {useRouter} from 'next/router'

import styles from '../../styles/Category.module.css'

const Category = ({linksWithProducts}) => {
  const { locale } = useRouter();

  return (
    <>
       {linksWithProducts?.map((linkWithProducts, i) => (
            <div key={i} className={styles.section}>
              <h2 className={styles.sectionTitle}>{linkWithProducts.title[locale]}</h2>

              <div><Catalog products={linkWithProducts.products}/></div>
            </div>
          ))}
    </>
  );
}

const getProducts = async slug => {
  const res = await fetch(`${process.env.DOMAIN}/api/links-with-products?slug=${slug}`);
  const linksWithProducts = await res.json();

  return linksWithProducts;
};
const getCategories = async () => {
  const res = await fetch(`${process.env.DOMAIN}/api/categories`);
  const categories = await res.json();

  return categories;
};

export async function getServerSideProps(context) {
  const {slug} = context.params;

  const categories = await getCategories();
  const linksWithProducts = await getProducts(slug);

  return { props: { categories, linksWithProducts, slug } };
}

export default Category

Category.getLayout = function getLayout(page) {
  return (
    <NestedLayoutCategory categories={page.props.categories} slug={page.props.slug}>{page}</NestedLayoutCategory>
  )
}