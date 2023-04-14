import styles from '@/src/styles/ProductViewCard.module.css'

import Image from 'next/image';
import Link from 'next/link';
import BuyButton from './buy-button';
import { useRouter } from 'next/router';
import { useTranslation } from '@/src/common/hooks/useTranslation';

export default function ProductViewCard({product, disabledBuy=false}) {
    const { locale } = useRouter();
    const {translate} = useTranslation();

    return (
        <div className={styles.product}>
            <Link href={'/product/' + product.id} className={styles.link}></Link>

            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div className={styles.containerImg}>
                        <div className={styles.wrapperImg}>
                            <div className={styles.postionImage}>
                                <div className={styles.image}>
                                    {product.image ? (
                                        <Image
                                            src={product.image.srcWebp}
                                            alt={product.image.alt}
                                            quality={100}
                                            width={product.image.width}
                                            height={product.image.height}
                                        />
                                    )                                    
                                    : (
                                        <Image
                                            src={'/images/placeholder.svg'}
                                            alt={'placeholder'}
                                            width={111}
                                            height={111}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.containerInfo}>
                        <div className={styles.priceTitle}>
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
                            <h3 className={styles.title}>{product.title[locale]}</h3>
                            <span className={styles.weightInfo}>{product.displayAmount} {translate(product.unit)}</span>
                        </div>
                        <div>
                            {!disabledBuy && <BuyButton disabled={!product.availableForSale} productId={product.id} secondary/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}