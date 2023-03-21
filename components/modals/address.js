import {useContext, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import Button from '@/components/elements/button';
import LocationContext from '@/context/location-context';
import { useTranslation } from '@/hooks/useTranslation';
import styles from "@/styles/Address.module.css";

export default function Address({onClose, productIdAfterLocation=null}) {
    const {location, updateAddress, setProductIdAfterLocation} = useContext(LocationContext);
    const { translate } = useTranslation();

    const inputBoxRef = useRef();
    const {register, handleSubmit} = useForm({
        defaultValues: {
          address: location.address?.address1 || ''
        }
    });

    useEffect(() => {
        focusInput();
    }, []);

    const focusInput = () => inputBoxRef.current.querySelector('input').focus();

    const onSubmit = async data => {
        try {
            let {address} = data;
            
            address = address.trim();
            if (!address) {
                throw('Error, empty address');
            }

            await updateLocationAPI(address);
            updateAddress({address1: address});
            setProductIdAfterLocation(productIdAfterLocation);
            onClose();
        } catch(e) {
            console.log(e);
        }
    };

    const updateLocationAPI = async address => {
        const body = {address};
        const res = await fetch('/api/front/location', {method: 'PUT',  headers: {
            'Content-Type': 'application/json',
            }, body: JSON.stringify(body)});

        return await res.json();
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <div className="input-box" ref={inputBoxRef}>
                    <input type='input' {...register("address", { required: true })} />
                </div>
                <Button fullWidth primary submit>{translate('ok')}</Button>
            </form>

            <img className={styles.mapImg} src="/images/delivery_zones.jpg" />
        </div> 
    )
}