import { useSelector } from 'react-redux';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import styles from '@/src/styles/Total.module.css';
import {getPriceFormat} from '@/src/common/utils/currency';

export default function Total() {
    const {cart} = useSelector(state => state.cart);
    const { translate } = useTranslation();

    return (
        <div>
            <div className={styles.container}>
              <div className={styles.top}>
                <h2 className={styles.subheading}>{translate('total')}</h2>
                <span className={styles.deliveryInfo}>{translate('shippingTime').replace('[time]', '1-3')}</span>
              </div>
              <table className={styles.totals}>
                <tbody>
                  <tr>
                    <th>{translate('products')}</th>
                    <td>&#8362;{getPriceFormat(cart.totalLineItemsPrice)}</td>
                  </tr>
                  {cart.totalDiscounts > 0 && (
                    <tr>
                      <th>{translate('discount')}</th>
                      <td><span className={styles.totalDiscounts}>−&#8362;{getPriceFormat(cart.totalDiscounts)}</span></td>
                    </tr>
                  )}
                  <tr>
                    <th>{translate('shipping')}</th>
                    <td>&#8362;{getPriceFormat(cart.totalShippingPrice)}</td>
                  </tr>
                  <tr>
                    <th>{translate('payment')}</th>
                    <td>&#8362;{getPriceFormat(cart.totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {cart.minTotalPrice > 0 && (
              <div className={styles.minTotalPrice}>
                <span>{translate('minTotalPrice')} &#8362;{getPriceFormat(cart.minTotalPrice)}</span>
              </div>
            )}
        </div>
    );
};