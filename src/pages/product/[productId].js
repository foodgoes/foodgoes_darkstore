import { useRouter } from 'next/router'
import Error from '../_error'
import Image from 'next/image';
import Link from 'next/link'
import Head from 'next/head'

import styles from '@/src/styles/Product.module.css'
import { useTranslation } from '@/src/common/hooks/useTranslation';
import BuyButton from '@/src/common/components/buy-button';
import ChevronRightSVG from '@/public/icons/chevron-right';

const Product = ({errorCode, breadcrumbs, product}) => {
  const { translate } = useTranslation();
  const {query, locale} = useRouter();

  const { productId } = query;

  let brandAndManif = '';
  if (product) {
    brandAndManif += product.brand && product.brand[locale] ? product.brand[locale] : '';
    brandAndManif += product.manufacturer && product.manufacturer[locale] ? ', ' + product.manufacturer[locale] : '';
  }

  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return (
    <>
      <Head>
        <title>{`${product.subTitle[locale]} — ${translate('metaTitleProduct')}`}</title>
      </Head>
      <div className={styles.wrapper}>
        <div className='topBar'>
          <div className='breadcrumbs'>
            <Link href="/">{translate('breadcrumbsHome')}</Link>
            {breadcrumbs.map((b,i) => (
                <div key={i}>
                    <ChevronRightSVG stroke='#9e9b98' />
                    <Link href={b.handle}>{b.title[locale]}</Link>
                </div>
            ))}
          </div>
          <div className='infoBlock'>
            <div>
              <h1 className='heading'>{product.subTitle[locale]}</h1>
              <span className={styles.shortInfo}>
                {product.displayAmount} {translate(product.unit)} &#8226; {product.pricePerUnit}&#8362;/{product.amountPerUnit}{translate(product.unit)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.imagesContainer}>
            <div className={styles.mainImage}>
              <Image
                  src={product.image.srcWebp}
                  alt={product.image.alt}
                  quality={100}
                  width={product.image.width}
                  height={product.image.height}
                  priority={true}
              />
            </div>
          </div>

          <div className={styles.aboutProduct}>
            <div className={styles.priceAndBtnBlock}>
              <div className={styles.priceBlock}>
                  {product.compareAtPrice ? (
                      <>
                          <span className={styles.compareAtPrice}>&#8362;{product.price.toFixed(2)}</span>
                          <span className={styles.oldPriceWithLine}>
                              <span className={styles.oldPrice}>&#8362;{product.compareAtPrice.toFixed(2)}</span>
                              <span className={styles.line}></span>
                          </span>
                      </>
                  ) : <span className={styles.price}>&#8362;{product.price.toFixed(2)}</span>}
              </div>
              <div><BuyButton disabled={!product.availableForSale} productId={productId} primary size="large"/></div>
            </div>

            <section className={styles.section}>
              <div className={styles.titleSection}><span><h2>{translate('aboutProduct')}</h2></span></div>
              <div className={styles.contentSection}>
                {brandAndManif && (
                  <div className={styles.blockContentSection}>
                    <span className={styles.label}>{translate('brand')}, {translate('manufacturer')}</span>
                    <p>{brandAndManif}</p>
                  </div>
                )}
                {product.country && product.country[locale] && (
                  <div className={styles.blockContentSection}>
                    <span className={styles.label}>{translate('country')}</span>
                    <p>{product.country[locale]}</p>
                  </div>
                )}
                {product.description && product.description[locale] && (
                  <div className={styles.blockContentSection}>
                    <span className={styles.label}>{translate('description')}</span>
                    <p>{product.description[locale]}</p>
                  </div>
                )}
                {product.ingredients && product.ingredients[locale] && (
                  <div className={styles.blockContentSection}>
                    <span className={styles.label}>{translate('ingredients')}</span>
                    <p>{product.ingredients[locale]}</p>
                  </div>
                )}
                {product.shelfLife && product.shelfLife[locale] && (
                  <div className={styles.blockContentSection}>
                    <span className={styles.label}>{translate('shelfLife')}</span>
                    <p>{product.shelfLife[locale]}</p>
                  </div>
                )}
                {product.disclaimer && product.disclaimer[locale] && (
                  <div className={styles.blockContentSection}>
                    <span className={styles.label}>{translate('disclaimer')}</span>
                    <p>{product.disclaimer[locale]}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

const getProduct = async productId => {
  const res = await fetch(`${process.env.DOMAIN}/api/front/product?productId=${productId}`);
  const errorCode = res.ok ? false : res.status;
  const data = await res.json();

  return { errorCode, ...data };
};

export async function getServerSideProps(context) {
  const {productId} = context.params;

  const { errorCode, breadcrumbs, product } = await getProduct(productId);

  return { props: { errorCode, breadcrumbs, product } };
}

export default Product