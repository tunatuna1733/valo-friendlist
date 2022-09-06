import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import Login from './components/Login';
import Friends from './components/screens/Friends';

const { myAPI } = window;

const App = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const result = await myAPI.startXmppClient();
                console.log(result);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [isLoggedIn]);

    return (
        <>
            {isLoggedIn === false ? <Login setLoggedIn={setLoggedIn}/> : <Friends />}
        </>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
