import React, { useEffect, useState } from 'react';

import IDPass from './screens/IDPass';
import TwoFA from './screens/TwoFA';
import Error from './screens/Error';

type Props = {
    setLoggedIn: (flag: boolean) => void;
}

export const Login: React.FC<Props> = (props) => {
    const [is2FA, setIs2FA] = useState(false);
    const [isError, setError] = useState(false);
    const [errorDetail, setErrorDetail] = useState<[string, string]>(['','']);

    return (
        <>
            { isError === false ?
                (is2FA === false ? <IDPass setIs2FA={setIs2FA} setLoggedIn={props.setLoggedIn} setError={setError} setErrorDetail={setErrorDetail} /> : <TwoFA setLoggedIn={props.setLoggedIn} setError={setError} setErrorDetail={setErrorDetail} />)
                : <Error error={errorDetail[0]} detail={errorDetail[1]} />
            }
        </>
    );
}

export default Login;