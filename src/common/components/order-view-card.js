import Link from 'next/link';
import styles from '@/src/styles/OrderViewCard.module.css';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import {getPriceFormat} from '@/src/common/utils/currency';

export default function OrderViewCard({order}) {
    const {translate} = useTranslation();

    const date = `${translate(order.date.monthCode)} ${order.date.day} ${translate('at')} ${order.date.hours}:${order.date.minuts}`;

    return (
        <div className={styles.order}>
            <div className={styles.top}>
                <div>
                    <h2 className={styles.date}>{date}</h2>
                    <Link className={styles.link} href={'/check/success?orderId='+order.id+'&from=history'}></Link>
                    <div className={styles.priceAndAddress}>
                        <span>&#8362;{getPriceFormat(order.totalPrice)}</span>
                        <span> · </span>
                        <span>{order.shippingAddress.address1}</span>
                    </div>
                </div>
                <span className={styles.label}>{translate(order.status)}</span>
            </div>
            <hr />
            <ul className={styles.lineItems}>
                {order.lineItems.map(lineItem => (
                    <li key={lineItem.id} className={styles.lineItem}><img width="100%" height="100%" src={lineItem.image.srcWebp} /></li>
                ))}
            </ul>
        </div>
    );
}