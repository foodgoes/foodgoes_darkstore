import { useRouter } from 'next/router';
import { useTranslation } from '@/src/hooks/useTranslation';
import SearchSVG from '@/public/icons/search';
import styles from '@/src/styles/SearchHeader.module.css';

export default function Search() {
    const router = useRouter();
    const { translate } = useTranslation();

    const queue = [];
    const handleKeyUpSearch = event => {
        try {
            queue.forEach(element => clearTimeout(element));

            const timeoutId = setTimeout(async () => {
                let q = event.target.value;
                q = q.trim().toLowerCase();

                if (q === '') {
                    return;
                }
                if (q.length < 3) {
                    return;
                }
                if (q.length > 25) {
                    return;
                }

                const pathname = '/search';

                if (router.pathname !== pathname) {
                    router.push({pathname, query: {text: q}}, undefined, { locale: router.locale });
                } else {
                    router.replace({pathname, query: {text: q}}, undefined, { locale: router.locale });
                }
            }, 1000);

            queue.push(timeoutId);
        } catch(e) {
            return;
        }
    };

    return (
        <div className={styles.search}>
            <span className={styles.icon}><SearchSVG /></span>
            <input type="text" placeholder={translate('search')} onKeyUp={handleKeyUpSearch} />
        </div>
    );
}