import ProductViewList from '../components/product-view-list'
import styles from '../styles/Order.module.css'

import { useTranslation } from '../hooks/useTranslation';

export default function Order({order}) {
    const { translate } = useTranslation();

    return (
        <div className={styles.order}>
            <div className={styles.info}>
                <div className={styles.section}>
                    <span className={styles.label}>{translate('orderId')}</span>
                    <div>{order.id}</div>
                </div>
                <div className={styles.section}>
                    <span className={styles.label}>{translate('date')}</span>
                    <div>{order.createdAt}</div>
                </div>
                <div className={styles.section + ' ' + styles.status}>
                    <div>
                        <span className={styles.label}>{translate('statusShipping')}</span>
                        <div>{order.statusShipping}</div>
                    </div>
                    <div>
                        <span className={styles.label}>{translate('statusPayment')}</span>
                        <div className={styles.paymentStatus}>{order.statusPayment}</div>
                    </div>
                </div>
                <div className={styles.section + ' ' + styles.totals}>
                    <div>
                        <span className={styles.label}>{translate('productsTotal')}</span>
                        <div>&#8362;{order.productsTotal}</div>
                    </div>
                    <div>
                        <span className={styles.label}>{translate('shippingTotal')}</span>
                        <div>&#8362;{order.shippingTotal}</div>
                    </div>
                    {order.discountTotal > 0 && (
                        <div>
                            <span className={styles.label}>{translate('discountTotal')}</span>
                            <div>&#8362;{order.discountTotal}</div>
                        </div>
                    )}
                </div>
                <div>
                    <span className={styles.label}>{translate('total')}</span>
                    <div className={styles.total}>&#8362;{order.total}</div>
                </div>
            </div>            
            <div className={styles.products}>
                <ul>
                    {order.products.map(p => <li key={p.id}><ProductViewList product={p} disabledBuy={true}/></li>)}
                </ul>
            </div>
        </div>
    )
}