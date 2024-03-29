import NestedLayoutCategory from '@/src/common/components/nested-layout-category'
import Catalog from '@/src/common/components/catalog'

const Category = ({products}) => {

  return (
    <>
      <Catalog products={products} />
    </>
  );
}

const getProductsAPI = async (slug, slug2, headers) => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/products?slug=${slug}&slug2=${slug2}`, {
    headers: {
      Cookie: headers.cookie
    }
  });
  return await res.json();
};
const getCategoriesAPI = async (headers) => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/categories`, {
    headers: {
      Cookie: headers.cookie
    }
  });
  return await res.json();
};

export async function getServerSideProps(context) {
  const {slug, slug2} = context.params;

  const categories = await getCategoriesAPI(context.req.headers);
  const {products, currentLinks} = await getProductsAPI(slug, slug2, context.req.headers);

  return { props: { categories, products, currentLinks, slug, slug2 } };
}


export default Category

Category.getLayout = function getLayout(page) {
  return (
    <NestedLayoutCategory categories={page.props.categories} slug={page.props.slug} slug2={page.props.slug2}>{page}</NestedLayoutCategory>
  )
}