import {useRouter} from 'next/router'
import dictionary from '../dictionary/dictionary'

export const useTranslation = () => {
    const { locale } = useRouter();

    return {
        translate: term => {
            return dictionary[locale][term];
        }
    };
}