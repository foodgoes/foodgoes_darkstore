import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import styles from '@/src/styles/Alert.module.css';
import ChevronRightSVG from '@/public/icons/chevron-right';
import Modal from "@/src/common/components/elements/modal";

export default function Alerts() {
    const [activeAlert, setActiveAlert] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [alert, setAlert] = useState();
    const { locale } = useRouter();
    const handleChangeAlert = useCallback(() => setActiveAlert(!activeAlert), [activeAlert]);

    useEffect(() => {
        const getAlerts = async () => {
            const res = await fetch('/api/front/alerts', {headers: {'Content-Type': 'application/json',}});
            const alerts = await res.json();
            setAlerts(alerts);
        };

        getAlerts();
    }, []);

    const showAlert = alertId => {
        setAlert(alerts.find(a => a.id === alertId));
        handleChangeAlert();
    };

    return (
        <>
        {activeAlert && createPortal(
            <Modal
                open={activeAlert}
                onClose={handleChangeAlert}
                title={alert.title[locale]}
                primaryAction={{
                    onAction: handleChangeAlert,
                    content: alert.action[locale]
                }}
            >
                <div>
                    {alert.image && <div className={styles.image}><img src={alert.image} /></div>}
                    <div dangerouslySetInnerHTML={{ __html: alert.descriptionHtml[locale] }}></div>
                    <p className={styles.caption}>{alert.caption[locale] }</p>
                </div>
            </Modal>,
            document.body
        )}
        <div className={styles.alerts}>
            {alerts.map(alert => (
                <div key={alert.id} className={styles.alertWrapped} onClick={() => showAlert(alert.id)}>
                    <div className={styles.alert}>
                        <div className={styles.alertContent}>
                            <div className={styles.icon}>
                                {alert.previewImage && <img src={alert.previewImage} />}
                            </div>
                            <div className={styles.text}><span>{alert.previewDescription[locale]}</span></div>
                        </div>
                        <div className={styles.icon2}><ChevronRightSVG width='48' height='48' /></div>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}