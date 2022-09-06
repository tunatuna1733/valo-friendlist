import React, { useState } from "react";

import IDPassModule from './IDPass.module.css';

const { myAPI } = window;

type Props = {
    setIs2FA: (flag: boolean) => void;
    setLoggedIn: (flag: boolean) => void;
    setError: (flag: boolean) => void;
    setErrorDetail: (error: [string, string]) => void;
}

const IDPass: React.FC<Props> = (props) => {
    const [isLoggingIn, setLoggingIn] = useState(false);
    const [riotID, setRiotID] = useState('');
    const [password, setPassword] = useState('');
    const submitIDPass = async (id: string, password: string) => {
        setLoggingIn(true);
        const result = await myAPI.sendIDPass(id, password);
        if (result['success'] === true) {
            if (result['twofa'] === true) {
                props.setIs2FA(true);
            } else {
                props.setIs2FA(false);
                props.setLoggedIn(true);
            }
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
        <div className={IDPassModule.container}>
            <div className={IDPassModule.mainText}>
                {`VALORANT\nFRIEND LIST\nSTORE`}
            </div>
            <div className={IDPassModule.inputID}>
                Input RiotID
            </div>
            <input type="text" className={IDPassModule.inputIDBox} placeholder='RiotID' onChange={(e) => setRiotID(e.target.value)} />
            <div className={IDPassModule.inputPass}>
                Input Password
            </div>
            <input type="password" className={IDPassModule.inputPassBox} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
            <button className={IDPassModule.loginButton} onClick={async () => {submitIDPass(riotID, password)}}>{ isLoggingIn ? `Logging In...` : `Login`}</button>
        </div>
    );
}

export default IDPass;