import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

import styles from '../../styles/Product.module.css'

import { useTranslation } from '../../hooks/useTranslation';

import BuyButton from '../../components/buy-button';

const Product = ({product}) => {
  const { translate } = useTranslation();
  const {query, locale} = useRouter();

  const { productId } = query;

  return (
    <>
      <Head>
        <title>{product.title[locale]} — купить с доставкой из FoodGoes</title>
      </Head>
      <div className='topBar'>
        <div className='breadcrumbs'>
          <Link href="/">{translate('breadcrumbsHome')}</Link>
        </div>
        <div className='infoBlock'>
          <div>
            <h1 className='heading'>{product.title[locale]}</h1>
          </div>
        </div>
      </div>
    
      <div className={styles.container}>
        <div className={styles.imagesContainer}>
          <div className={styles.mainImage}><img src={product.image} /></div>
        </div>

        <div className={styles.aboutProduct}>
          <div className={styles.priceAndBtnBlock}>
            <div className={styles.priceBlock}>
                {product.discountPrice ? (
                    <>
                        <span className={styles.discountPrice}>&#8362;{product.discountPrice}</span>
                        <span className={styles.oldPriceWithLine}>
                            <span className={styles.oldPrice}>&#8362;{product.price}</span>
                            <span className={styles.line}></span>
                        </span>
                    </>
                ) : <span className={styles.price}>&#8362;{product.price}</span>}
            </div>
            <div><BuyButton disabled={!product.quantity} price={product.discountPrice || product.price} productId={productId} primary size="large"/></div>
          </div>

          <section className={styles.section}>
            <div className={styles.titleSection}><span><h2>{translate('aboutProduct')}</h2></span></div>
            <div className={styles.contentSection}>
              {product.description && (
                <div className={styles.blockContentSection}>
                  <span className={styles.label}>{translate('compound')}</span>
                  <p>{product.description[locale]}</p>
                </div>
              )}
              {product.vendor && (
                <div className={styles.blockContentSection}>
                  <span className={styles.label}>{translate('vendor')}</span>
                  <p>{product.vendor[locale]}</p>
                </div>
              )}
              {product.brand && (
                <div className={styles.blockContentSection}>
                  <span className={styles.label}>{translate('brand')}</span>
                  <p>{product.brand[locale]}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

const getProduct = async productId => {
  const res = await fetch(`${process.env.DOMAIN}/api/product?productId=${productId}`);
  const product = await res.json();

  return product;
};

export async function getServerSideProps(context) {
  const {productId} = context.params;

  const product = await getProduct(productId);

  return { props: { product } };
}

export default Product