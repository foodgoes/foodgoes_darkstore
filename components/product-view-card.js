import styles from '../styles/ProductViewCard.module.css'

import Link from 'next/link';
import BuyButton from './buy-button';
import { useRouter } from 'next/router';

export default function ProductViewCard({product, disabledBuy=false}) {
    const { locale } = useRouter();

    return (
        <div className={styles.product}>
            <Link href={'/product/' + product.id} className={styles.link}></Link>

            <div className={styles.wrapper}>
                <div>
                    {product.image && <img src={product.image} />}
                </div>
                <div className={styles.info}>
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
                    
                    <h3 className={styles.title}>{product.title[locale]}</h3>
                </div>
                {!disabledBuy && <BuyButton productId={product.id} price={product.discountPrice || product.price} disabled={!product.quantity} secondary/>}
            </div>
        </div>
    );
}