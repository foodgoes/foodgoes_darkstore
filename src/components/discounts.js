import { useState, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import styles from '@/src/styles/Alert.module.css'
import OfferSVG from '@/public/icons/offer'
import ChevronRightSVG from '@/public/icons/chevron-right';
import { useTranslation } from '@/src/hooks/useTranslation';
import Modal from './elements/modal';
import Button from './elements/button';

export default function Discounts() {
    const {discounts} = useState({products: []});
    const [activeDiscount, setActiveDiscount] = useState(false);
    const [discount, setDiscount] = useState(false);
    const { locale } = useRouter();
    const { translate } = useTranslation();

    const handleChangeDiscount = useCallback(discount => {
        setDiscount(discount);
        setActiveDiscount(!activeDiscount),
    [activeDiscount];
    });

    return (
        <>
            
            <Modal
                open={activeDiscount}
                onClose={() => handleChangeDiscount(null)}
            >
                <div className={styles.modalContent}>
                    <img src='/images/percentage.png' className={styles.modalImage} />
                    <div className={styles.modalContent}>
                    {discount && (
                        <>
                            <h4 className={'heading ' + styles.modalTitle}>{discount.title[locale]}</h4>
                            <p className={styles.modalDesc}>{discount.description[locale]}</p>
                        </>
                    )}
                    </div>
                    <Button primary={true} fullWidth={true} size='large' onClick={() => handleChangeDiscount(null)}>
                        {translate('clear')}
                    </Button>
                </div>
            </Modal>

            <div>
                {discounts?.products.map(discount => (
                    <div key={discount.id}>
                        <div className={styles.alert} onClick={() => handleChangeDiscount(discount)}>
                            <div className={styles.leftSide}>
                                <div className={styles.icon}><OfferSVG stroke='#ff5b37' width='48' height='48' /></div>
                                <div className={styles.text}>{discount.previewDescription[locale]}</div>
                            </div>
                            <div className={styles.icon}><ChevronRightSVG width='48' height='48' /></div>
                        </div> 
                    </div>
                ))}
            </div>
        </>
    );
}