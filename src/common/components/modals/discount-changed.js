import { useTranslation } from '@/src/common/hooks/useTranslation';

export default function DiscountChanged() {
    const { translate } = useTranslation();

    return (
        <div>
            <p>{translate('priceAndTotalsUpdated')}</p>
        </div> 
    )
}