import styles from '../styles/Catalog.module.css'

import ProductViewCard from './product-view-card';
import ProductViewList from './product-view-list';

export default function Catalog({products, disabledBuy=false, view='card'}) {
    return (
        <div className={styles.catalog}>
            {products.map(p => <div key={p.id}>
                {view === 'card' && <ProductViewCard product={p} disabledBuy={disabledBuy}/>}
                {view === 'list' && <ProductViewList product={p} disabledBuy={disabledBuy}/>}
                </div>)}
        </div>
    );
}