import {useRouter} from 'next/router'

import NestedLayoutCategory from '../../../components/nested-layout-category'
import Catalog from '../../../components/catalog'

const Category = ({products}) => {

  return (
    <>
      <Catalog products={products} />
    </>
  );
}

const getProducts = async (slug, slug2) => {
  const res = await fetch(`${process.env.DOMAIN}/api/products?slug=${slug}&slug2=${slug2}`);
  return await res.json();
};
const getCategories = async () => {
  const res = await fetch(`${process.env.DOMAIN}/api/categories`);
  const categories = await res.json();

  return categories;
};

export async function getServerSideProps(context) {
  const {slug, slug2} = context.params;

  const categories = await getCategories();
  const {products, currentLinks} = await getProducts(slug, slug2);

  return { props: { categories, products, currentLinks, slug, slug2 } };
}


export default Category

Category.getLayout = function getLayout(page) {
  return (
    <NestedLayoutCategory categories={page.props.categories} slug={page.props.slug} slug2={page.props.slug2}>{page}</NestedLayoutCategory>
  )
}