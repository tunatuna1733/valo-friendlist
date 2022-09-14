import React, { useEffect, useState } from "react";
import { isGameRes, isLobbyRes, isPregameRes } from "../../../shared/typeguard";

import FriendsModule from '../../../styles/Friends.module.css';
import CareerModal from "./CareerModal";
import LobbyPresence from "./LobbyPresence";
import PregamePresence from "./PregamePresence";
import Presence from "./Presence";

const { myAPI } = window;

const Friends: React.FC = () => {
    const [presenceList, setPresenceList] = useState<(GameRes | LobbyRes | PregameRes)[]>();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setModalOpen] = useState<ModalOptions>({ isOpen: false, riotID: '', tag: '', puuid: '', rankNum: -1, cardId: '' });
    useEffect(() => {
        myAPI.sendPresences((presence) => {
            if (!isLoaded && presence.presences !== undefined) setIsLoaded(true);
            setPresenceList(presence.presences);
        });
        /*
        const timeoutId = setTimeout(() => {
            if (!isLoaded) {
                console.log('restarting xmpp');
                myAPI.endXmppClient().then(async () => {
                    await myAPI.startXmppClient();
                });
            }
        }, 4000);

        return () => {
            if (isLoaded) {
                clearTimeout(timeoutId);
            }
        };
        */
    }, []);

    const handleModalClose = () => {
        setModalOpen({ isOpen: false, riotID: '', tag: '', puuid: '', rankNum: -1, cardId: '' });
    }

    useEffect(() => {
        console.log(presenceList);
    }, [presenceList]);

    return (
        <>
            <div className={FriendsModule.container}>
                <header>
                    <div className={FriendsModule.mainText}>
                        Friend List
                    </div>
                </header>
                <div className={FriendsModule.presences}>
                    {typeof presenceList !== 'undefined' ?
                        presenceList.map((presence, i) => {
                            if (isGameRes(presence)) {
                                return (
                                    <Presence state={presence.state} puuid={presence.puuid} rankNum={presence.rankNum} riotID={presence.riotID} tag={presence.tag} mode={presence.mode} map={presence.map} score={presence.score} partyIconNum={presence.partyIconNum} lastModified={presence.lastModified} frame={presence.frame} card={presence.card} onClick={setModalOpen} key={i} />
                                );
                            } else if (isPregameRes(presence)) {
                                return (
                                    <PregamePresence state={presence.state} puuid={presence.puuid} rankNum={presence.rankNum} riotID={presence.riotID} tag={presence.tag} mode={presence.mode} map={presence.map} partyIconNum={presence.partyIconNum} lastModified={presence.lastModified} frame={presence.frame} card={presence.card} onClick={setModalOpen} key={i} />
                                )
                            } else if (isLobbyRes(presence)) {
                                return (
                                    <LobbyPresence state={presence.state} puuid={presence.puuid} rankNum={presence.rankNum} riotID={presence.riotID} tag={presence.tag} isAFK={presence.isAFK} partyIconNum={presence.partyIconNum} lastModified={presence.lastModified} frame={presence.frame} card={presence.card} onClick={setModalOpen} key={i} />
                                );
                            }
                        }) : <h1>Loading...</h1>
                    }
                    {isModalOpen.isOpen === true ?
                        <CareerModal riotID={isModalOpen.riotID} tag={isModalOpen.tag} puuid={isModalOpen.puuid} rankNum={isModalOpen.rankNum} cardId={isModalOpen.cardId} handleModal={handleModalClose} />
                        : <div></div>}
                </div>
            </div>
        </>
    );
}

export default Friends;