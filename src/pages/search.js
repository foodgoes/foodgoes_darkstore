import styles from '@/src/styles/Search.module.css'

import Sidebar from '@/src/common/components/sidebar'
import Catalog from '@/src/common/components/catalog';

import { useTranslation } from '@/src/common/hooks/useTranslation';

export default function Search({categories, search}) {
  const { translate } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Sidebar categories={categories} />

      <div className={styles.main}>
        {search && !search.count && <h1 className={styles.headingSearch}>{translate('emptySearch').replace('[searchPhrase]', search.phrase)}</h1>}
        {search && search.count > 0 && (
          <>
            <h1 className={styles.headingSearch}>{translate('notEmptySearch').replace('[searchPhrase]', search.phrase).replace('[searchCount]', search.count)}</h1>
            <Catalog products={search.products ?? []} />
          </>
        )}
      </div>
    </div>
  )
}

const getCategories = async (headers) => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/categories`, {
    headers: {
      Cookie: headers.cookie
    }
  });
  const categories = await res.json();

  return categories;
};
const getProductsByQuery = async (query, locale='en', headers) => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/search?q=${query}&locale=${locale}`, {
    headers: {
      Cookie: headers.cookie
    }
  });
  return await res.json();
};

export async function getServerSideProps(context) {
  const {text} = context.query;
  const {locale} = context;

  if (!text) {
    return {
      redirect: {
        destination: '/'+locale,
        permanent: false,
      },
    }
  }
  
  const categories = await getCategories(context.req.headers);
  const search = text && await getProductsByQuery(text, locale, context.req.headers);

  return { props: { categories, search } };
}