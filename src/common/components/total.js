import { useSelector } from 'react-redux';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import styles from '@/src/styles/Total.module.css';

export default function Total() {
    const {cart} = useSelector(state => state.cart);
    const { translate } = useTranslation();
    
    const minTotalPrice = 50;
    const totalDiscounts = 0;
    const totalShippingPrice = 30;
    const totalLineItemsPrice = cart.total;
    const subtotalPrice = totalLineItemsPrice - totalDiscounts;
    const totalPrice = subtotalPrice + totalShippingPrice;

    return (
        <div>
            <div className={styles.container}>
              <div className={styles.top}>
                <h2 className={styles.subheading}>{translate('total')}</h2>
                <span className={styles.deliveryInfo}>{translate('shippingTime').replace('[time]', '3-5')}</span>
              </div>
              <table className={styles.totals}>
                <tbody>
                  <tr>
                    <th>{translate('products')}</th>
                    <td>&#8362;{totalLineItemsPrice.toFixed(2)}</td>
                  </tr>
                  {totalDiscounts > 0 && (
                    <tr>
                      <th>{translate('discount')}</th>
                      <td><span className={styles.totalDiscounts}>−&#8362;{totalDiscounts}</span></td>
                    </tr>
                  )}
                  <tr>
                    <th>{translate('shipping')}</th>
                    <td>&#8362;{totalShippingPrice}</td>
                  </tr>
                  <tr>
                    <th>{translate('payment')}</th>
                    <td>&#8362;{totalPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className={styles.minTotalPrice}>
              <span>{translate('minTotalPrice')} &#8362;{minTotalPrice}</span>
            </div>
        </div>
    );
};