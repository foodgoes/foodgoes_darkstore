import styles from '../styles/ProductViewList.module.css'
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
                    <img src={product.image} />
                </div>
                <div>
                    <div className={styles.title}><h3>{product.title[locale]}</h3></div>
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
                </div>
            </div>
            <div className={styles.quantityBlock}>
                {!disabledBuy && <BuyButton productId={product.id} price={product.discountPrice || product.price} disabled={!product.quantity} size='small' />}
                {disabledBuy && (
                    <div className={styles.quantity}><span>{product.quantity}</span></div>
                )}
            </div>
        </div>
    );
}