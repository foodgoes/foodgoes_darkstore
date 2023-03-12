import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import GlobeSVG from '@/public/icons/globe';
import Button from '@/components/elements/button';
import Modal from '@/components/elements/modal';
import LocalesList from '@/components/modals/locales-list';
import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/LocaleSwitcherHeader.module.css';

export default function LocaleSwitcherHeader() {
    const [activeLocales, setActiveLocales] = useState(false);
    const handleChangeLocales = useCallback(() => setActiveLocales(!activeLocales), [activeLocales]);
    
    const { translate } = useTranslation();

    return (
        <>
            {activeLocales && createPortal(
                <Modal
                    open={activeLocales}
                    onClose={handleChangeLocales}
                    title={translate('modalLocalesTitle')}
                >
                    <LocalesList onClose={handleChangeLocales} />
                </Modal>,
                document.body
            )}
            <div className={styles.globe}>
                <Button plain onClick={handleChangeLocales}><GlobeSVG /></Button>
            </div>
        </>
    );
}