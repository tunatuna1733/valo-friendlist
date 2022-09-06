import React, { useEffect, useState } from "react";
import { isGameRes, isLobbyRes, isPregameRes } from "../../../shared/typeguard";

import FriendsModule from './Friends.module.css';
import LobbyPresence from "./LobbyPresence";
import Presence from "./Presence";

const { myAPI } = window;

let isLoaded = false;

const Friends: React.FC = () => {
    const [presenceList, setPresenceList] = useState<(GameRes | LobbyRes | PregameRes)[]>();
    useEffect(() => {
        myAPI.sendPresences((presence) => {
            if (!isLoaded) isLoaded = true;
            setPresenceList(presence.presences);
        });
        setTimeout(() => {
            if (!isLoaded) {
                myAPI.endXmppClient().then(async () => {
                    await myAPI.startXmppClient();
                });
            }
        }, 4000);
        // debug
        setTimeout(async () => {
            await myAPI.debugEndpoint();
        }, 10000);
    }, []);

    useEffect(() => {
        console.log(presenceList);
    }, [presenceList]);

    const presenceElem = (presenceList: (GameRes | LobbyRes | PregameRes)[] | undefined) => {
        const elem: JSX.Element[] = [];
        if (typeof presenceList !== 'undefined'){
            for (const presence of presenceList) {
                if (isGameRes(presence)) {
                    elem.push(
                        <li key={presence.puuid}>
                            <Presence state={presence.state} puuid={presence.puuid} rankNum={presence.rankNum} riotID={presence.riotID} tag={presence.tag} mode={presence.mode} map={presence.map} score={presence.score} partyIconNum={presence.partyIconNum} />
                        </li>
                    );
                } else if (isPregameRes(presence)) {
                    
                } else if (isLobbyRes(presence)) {
                    elem.push(
                        <li key={presence.puuid}>
                            <LobbyPresence state={presence.state} puuid={presence.puuid} rankNum={presence.rankNum} riotID={presence.riotID} tag={presence.tag} isAFK={presence.isAFK} partyIconNum={presence.partyIconNum} />
                        </li>
                    );
                }
            }
            return elem;
        } else {
            return (
                <h1>Loading...</h1>
            )
        }
    }

    return (
        <>
            <div className={FriendsModule.container}>
                <header>
                    <div className={FriendsModule.mainText}>
                        Friend List
                    </div>
                    <hr className={FriendsModule.line} />
                </header>
                <div className={FriendsModule.presences}>
                {typeof presenceList !== 'undefined' ? 
                    presenceList.map((presence, i) => {
                        if (isGameRes(presence)) {
                            console.log('InGame');
                            return (
                                <Presence state={presence.state} puuid={presence.puuid} rankNum={presence.rankNum} riotID={presence.riotID} tag={presence.tag} mode={presence.mode} map={presence.map} score={presence.score} partyIconNum={presence.partyIconNum} key={i} />
                            );
                        } else if (isPregameRes(presence)) {
                        } else if (isLobbyRes(presence)) {
                            return (
                                <LobbyPresence state={presence.state} puuid={presence.puuid} rankNum={presence.rankNum} riotID={presence.riotID} tag={presence.tag} isAFK={presence.isAFK} partyIconNum={presence.partyIconNum} key={i} />
                            );
                        }
                    }) : <h1>Loading...</h1>
                    }
                </div>
            </div>
        </>
    );
}

export default Friends;