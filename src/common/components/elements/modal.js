import styles from '@/src/styles/Modal.module.css'
import Button from '@/src/common/components/elements/button';
import CloseSVG from '@/public/icons/close'

export default function Modal(props) {
    const {activator, open, title, onClose, children, primaryAction, secondaryActions} = props;

    return (
        <>
            {activator && <div>{activator}</div>}
            
            { open && (
                <>
                    <div className={styles.overlay} onClick={onClose}></div>
                    <div className={styles.modal}>
                        <div className={styles.container}>
                            <div className={styles.header}>
                                <div>{title && <h2>{title}</h2>}</div>
                                <Button plain onClick={onClose}><CloseSVG /></Button>
                            </div>
                            {children && (
                                <div className={styles.content}>{children}</div>
                            )}
                            <div className={styles.footer}>
                                {primaryAction && <Button primary={true} onClick={primaryAction.onAction}>{primaryAction.content}</Button>}
                                {secondaryActions && (
                                    <div className={styles.secondaryActions}>
                                        {secondaryActions.map((secondaryAction, i) => 
                                            <div key={i}><Button onClick={secondaryAction.onAction}>{secondaryAction.content}</Button></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}