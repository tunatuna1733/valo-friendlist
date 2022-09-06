import React, { useState } from "react";

import TwoFAModule from "./TwoFA.module.css";

const { myAPI } = window;

type Props = {
    setLoggedIn: (flag: boolean) => void;
    setError: (flag: boolean) => void;
    setErrorDetail: (error: [string, string]) => void;
}

const TwoFA: React.FC<Props> = (props) => {
    const [isLoggingIn, setLoggingIn] = useState(false);
    const [twoFACode, setTwofFACode] = useState('');
    const submitTwoFA = async (code: string) => {
        setLoggingIn(true);
        console.log(code);
        const result = await myAPI.send2FACode(code);
        if (result['success'] === true) {
            props.setLoggedIn(true);
        } else {
            props.setError(true);
            if (result['error']) {
                if (result['detail'])
                    props.setErrorDetail([result['error'], result['detail']]);
                else
                    props.setErrorDetail([result['error'], 'No details']);
            }
        }
    }

    return (
        <div className={TwoFAModule.container}>
            <div className={TwoFAModule.mainText}>
                {`Two Factor\nAuthentication`}
            </div>
            <div className={TwoFAModule.inputTwoFA}>
                Please Input TwoFA Code
            </div>
            <input type="text" className={TwoFAModule.inputTwoFABox} placeholder="TwoFA Code" onChange={(e) => setTwofFACode(e.target.value)} inputMode='numeric' pattern="[0-9]*"/>
            <button className={TwoFAModule.loginButton} onClick={async () => { submitTwoFA(twoFACode) }}>{isLoggingIn ? `Logging In...` : `Login`}</button>
        </div>
    );
}

export default TwoFA;