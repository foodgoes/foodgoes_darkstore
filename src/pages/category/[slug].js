import NestedLayoutCategory from '@/src/common/components/nested-layout-category'
import Catalog from '@/src/common/components/catalog'

import {useRouter} from 'next/router'

import styles from '@/src/styles/Category.module.css'

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

const getProductsAPI = async slug => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/categories-with-products?slug=${slug}`);
  return await res.json();
};
const getCategoriesAPI = async () => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/categories`);
  return await res.json();
};

export async function getServerSideProps(context) {
  const {slug} = context.params;

  const categories = await getCategoriesAPI();
  const linksWithProducts = await getProductsAPI(slug);

  return { props: { categories, linksWithProducts, slug } };
}

export default Category

Category.getLayout = function getLayout(page) {
  return (
    <NestedLayoutCategory categories={page.props.categories} slug={page.props.slug}>{page}</NestedLayoutCategory>
  )
}