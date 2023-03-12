import { useState, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Alert.module.css'
import OfferSVG from '@/public/icons/offer'
import ChevronRightSVG from '@/public/icons/chevron-right';

import Modal from './elements/modal';
import Button from './elements/button';
import DiscountContext from '@/context/discount-context';

export default function Discounts() {
    const {discounts} = useContext(DiscountContext);
    const [activeDiscount, setActiveDiscount] = useState(false);
    const { locale } = useRouter();

    const handleChangeDiscount = useCallback(() => setActiveDiscount(!activeDiscount), [activeDiscount]);

    return (
        <div>
            {discounts.products.map(discount => (
                <div key={discount.id}>
                    <Modal
                        open={activeDiscount}
                        onClose={handleChangeDiscount}
                    >
                        <div className={styles.modalContent}>
                            <img src='/images/percentage.png' className={styles.modalImage} />
                            <div className={styles.modalContent}>
                                <h4 className={'heading ' + styles.modalTitle}>{discount.title[locale]}</h4>
                                <p className={styles.modalDesc}>{discount.description[locale]}</p>
                            </div>
                            <Button primary={true} fullWidth={true} size='large' onClick={handleChangeDiscount}>Понятно</Button>
                        </div>
                    </Modal>

                    <div className={styles.alert} onClick={handleChangeDiscount}>
                        <div className={styles.leftSide}>
                            <div className={styles.icon}><OfferSVG stroke='#ff5b37' width='48' height='48' /></div>
                            <div className={styles.text}>{discount.previewDescription[locale]}</div>
                        </div>
                        <div className={styles.icon}><ChevronRightSVG width='48' height='48' /></div>
                    </div> 
                </div>
            ))}
        </div>
    );
}