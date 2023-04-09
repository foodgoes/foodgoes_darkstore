import styles from '@/src/styles/ProductViewList.module.css'
import Image from 'next/image';
import Link from 'next/link'
import BuyButton from './buy-button';

import {useRouter} from 'next/router'

export default function ProductViewList({product, disabledBuy=false}) {
    const { locale } = useRouter();

    return (
        <div className={styles.product}>
            <div className={styles.info}>
                <Link href={`/product/${product.id}`} className={styles.link}></Link>
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
                <div>
                    <div className={styles.title}><h3>{product.title[locale]}</h3></div>
                    <div className={styles.priceBlock}>
                        {product.compareAtPrice ? (
                            <>
                                <span className={styles.compareAtPrice}>&#8362;{product.price}</span>
                                <span className={styles.oldPriceWithLine}>
                                    <span className={styles.oldPrice}>&#8362;{product.compareAtPrice}</span>
                                    <span className={styles.line}></span>
                                </span>
                            </>
                        ) : <span className={styles.price}>&#8362;{product.price}</span>}
                    </div>
                </div>
            </div>
            <div className={styles.quantityBlock}>
                {!disabledBuy && <BuyButton disabled={!product.availableForSale} 
                productId={product.id} price={product.price} size='small' />}
                {disabledBuy && (
                    <div className={styles.quantity}><span>{product.quantity}</span></div>
                )}
            </div>
        </div>
    );
}