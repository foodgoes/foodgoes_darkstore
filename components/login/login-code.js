import {useEffect, useRef} from "react";

import {getAdditionalUserInfo } from "firebase/auth";
import {useForm} from "react-hook-form";

import { useTranslation } from '../../hooks/useTranslation';

import Button from "../elements/button";

export default function LoginCode({onClose}) {
    const { translate } = useTranslation();
    const { register, handleSubmit } = useForm();

    const inputBoxRef = useRef();

    useEffect(() => {
        focusInput();
    }, []);

    const focusInput = () => inputBoxRef.current.querySelector('input').focus();

    const onSubmit = async data => {
        try {
            const {code} = data;

            window.confirmationResult.confirm(code).then(async (result) => {
                const user = result.user;
                
                const {isNewUser} = getAdditionalUserInfo(result);
                if (isNewUser) {
                    const body = {provider: 'firebase', id: user.uid, phoneNumber: user.phoneNumber};
                    fetch('/api/account/signup', {method: 'POST',  headers: {
                        'Content-Type': 'application/json',
                      }, body: JSON.stringify(body)})
                      .then((res) => res.json())
                      .then((data) => {
                        console.log('data', data)
                    });
                } else {
                    const body = {phoneNumber: user.phoneNumber};
                    fetch('/api/account/activate_session', {method: 'POST',  headers: {
                        'Content-Type': 'application/json',
                      }, body: JSON.stringify(body)})
                      .then((res) => res.json())
                      .then((data) => {
                        console.log('data', data)
                    });
                }

                onClose();
            }).catch((error) => {
                focusInput();
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-block">
            <label>{translate('code')}</label>
                <div className="input-box" ref={inputBoxRef}>
                    <input type='input' {...register("code", { required: true })} />
                </div>
            </div>
            <Button fullWidth submit primary>{translate('login')}</Button>
        </form>
    );
}