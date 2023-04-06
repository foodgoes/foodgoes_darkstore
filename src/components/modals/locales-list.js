import {useRouter} from 'next/router'
import Button from '@/src/components/elements/button';
import styles from '@/src/styles/LocalesList.module.css'

export default function LocalesList({onClose}) {
    const router = useRouter();

    const goToLocale = locale => {
        router.push(router.asPath, router.asPath, { locale });
        onClose();
    }

    return (
        <div className={styles.localesList}>
            <Button fullWidth onClick={() => goToLocale('en')}>English</Button>
            <Button fullWidth onClick={() => goToLocale('he')}>Hebrew</Button>
            <Button fullWidth onClick={() => goToLocale('ru')}>Russian</Button>
        </div> 
    )
}