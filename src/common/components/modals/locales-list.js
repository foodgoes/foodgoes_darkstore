import {useRouter} from 'next/router';
import { useSelector } from 'react-redux';
import Button from '@/src/common/components/elements/button';
import styles from '@/src/styles/LocalesList.module.css';

export default function LocalesList({onClose}) {
    const router = useRouter();

    const {user: auth} = useSelector(state => state.auth);

    const goToLocale = locale => {
        if (auth) {
            updateUserAPI({locale});
        }

        router.push(router.asPath, router.asPath, { locale });
        onClose();
    }

    const updateUserAPI = async ({locale}) => {
        const body = {locale};
        const res = await fetch('/api/front/user', {method: 'PUT',  headers: {
            'Content-Type': 'application/json',
            }, body: JSON.stringify(body)});

        return await res.json();
    };

    return (
        <div className={styles.localesList}>
            <Button fullWidth onClick={() => goToLocale('en')}>English</Button>
            <Button fullWidth onClick={() => goToLocale('he')}>Hebrew</Button>
            <Button fullWidth onClick={() => goToLocale('ru')}>Russian</Button>
        </div> 
    )
}