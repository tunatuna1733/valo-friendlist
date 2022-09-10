import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import Login from './components/Login';
import Friends from './components/screens/Friends';

const { myAPI } = window;

const App = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isAlreadyLoggedIn, setAlreadyLoggedIn] = useState<boolean>();

    useEffect(() => {
        if (isLoggedIn === true) {
            (async () => {
                try {
                    const result = await myAPI.startXmppClient();
                    console.log(result);
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        (async () => {
            myAPI.reauth().then((result) => {
                console.log(result);
                if (result === 'Not ready') {
                    setAlreadyLoggedIn(false);
                } else {
                    setAlreadyLoggedIn(true);
                }
            });
            /*
            myAPI.fetchSsidCookie().then((cookie) => {
                console.log(cookie);
                if (cookie === 'None') {
                    setAlreadyLoggedIn(false);
                } else {
                    myAPI.reauth(cookie).then((result) => {
                        console.dir(result, { depth: null });
                        setAlreadyLoggedIn(result.success);
                    });
                }
            });*/
        })();
    }, []);

    return (
        <>
            { isAlreadyLoggedIn === true ? 
                <Friends />
                : (isAlreadyLoggedIn === false ? (isLoggedIn === false ? <Login setLoggedIn={setLoggedIn} /> : <Friends />)
                : <h1>Loading...</h1>)
            }
        </>
    );
};

/*
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);*/

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
);