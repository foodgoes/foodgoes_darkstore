import {useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useForm} from 'react-hook-form';
import Button from '@/src/common/components/elements/button';
import { useTranslation } from '@/src/common/hooks/useTranslation';
import styles from '@/src/styles/Address.module.css';

import { updateLocation, logProductIdAfterlocation, selectProductIdBeforelocation } from '@/src/features/location/locationSlice';

export default function Address({onClose}) {
    const dispatch = useDispatch();
    const productIdBeforelocation = useSelector(selectProductIdBeforelocation);

    const {location} = useSelector(state => state.location);

    const { translate } = useTranslation();

    const inputBoxRef = useRef();
    const {register, handleSubmit} = useForm({
        defaultValues: {
          address: location ? location.address?.address1 : ''
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

            const location = await updateLocationAPI(address);
            dispatch(updateLocation(location));
            if (productIdBeforelocation) {
                dispatch(logProductIdAfterlocation(productIdBeforelocation));
            }
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
            <form className="form">
                <div className="input-box" ref={inputBoxRef}>
                    <input type='input' {...register("address", { required: true })} />
                </div>
                <Button onClick={handleSubmit(onSubmit)} fullWidth primary submit>{translate('ok')}</Button>
            </form>

            <img className={styles.mapImg} src="/images/delivery_zones.jpg" />
        </div> 
    )
}