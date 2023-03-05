import {useState} from "react";
import LoginPhone from "./login-phone";
import LoginCode from "./login-code";

export default function Login({onClose, fromPage}) {
    const [step, setStep] = useState(1);
    
    return (
        <div>
            {step === 1 && <LoginPhone setStep={setStep} />}
            {step === 2 && <LoginCode onClose={onClose} fromPage={fromPage} />}
        </div>
    )
}