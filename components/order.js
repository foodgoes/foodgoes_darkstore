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
                    <div><strong>#{order.orderNumber}</strong></div>
                </div>
                <div className={styles.section}>
                    <span className={styles.label}>{translate('date')}</span>
                    <div>{order.date}</div>
                </div>
                <div className={styles.section + ' ' + styles.status}>
                    <div>
                        <span className={styles.label}>{translate('fulfillmentStatus')}</span>
                        <div>{order.fulfillmentStatus}</div>
                    </div>
                    <div>
                        <span className={styles.label}>{translate('financialStatus')}</span>
                        <div className={styles.paymentStatus}>{order.financialStatus}</div>
                    </div>
                </div>
                <div className={styles.section + ' ' + styles.totals}>
                    <div>
                        <span className={styles.label}>{translate('totalLineItemsPrice')}</span>
                        <div>&#8362;{order.totalLineItemsPrice}</div>
                    </div>
                    <div>
                        <span className={styles.label}>{translate('totalShippingPrice')}</span>
                        <div>&#8362;{order.totalShippingPrice}</div>
                    </div>
                    {order.totalDiscounts > 0 && (
                        <div>
                            <span className={styles.label}>{translate('totalDiscounts')}</span>
                            <div>&#8362;{order.totalDiscounts}</div>
                        </div>
                    )}
                </div>
                <div>
                    <span className={styles.label}>{translate('total')}</span>
                    <div className={styles.total}>&#8362;{order.totalPrice}</div>
                </div>
            </div>            
            <div className={styles.products}>
                <ul>
                    {order.lineItems.map(p => <li key={p.id}><ProductViewList product={p} disabledBuy={true}/></li>)}
                </ul>
            </div>
        </div>
    )
}