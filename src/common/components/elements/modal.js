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
                                <Button plain onClick={onClose} size="small"><CloseSVG /></Button>
                            </div>
                            {children && (
                                <div className={styles.content}>{children}</div>
                            )}
                            {(primaryAction || secondaryActions) && (
                                 <div className={styles.footer}>
                                    {secondaryActions && (
                                        <>
                                            {secondaryActions.map((secondaryAction, i) => 
                                                <Button key={i} onClick={secondaryAction.onAction}>{secondaryAction.content}</Button>
                                            )}
                                        </>
                                    )}
                                    {primaryAction && <Button primary={true} onClick={primaryAction.onAction}>{primaryAction.content}</Button>}
                                 </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}