import React from "react";

import { rankUrl, partyIcons, frameUrl, cardUrl } from "../../../shared/assets";
import LobbyPresenceModule from '../../../styles/LobbyPresence.module.css';

const LobbyPresence: React.FC<LobbyRes> = (props) => {
    const rankIconUrl = rankUrl(props.rankNum);
    const partyIconName = partyIcons(props.partyIconNum);
    const frameImageUrl = frameUrl(props.frame);
    const cardImageUrl = cardUrl(props.card);
    return (
        <div className={LobbyPresenceModule.presence}>
            <img src={frameImageUrl} alt="" className={LobbyPresenceModule.cardFrame} />
            <img src={cardImageUrl} alt="" className={LobbyPresenceModule.playerCard} />
            <img src={rankIconUrl} alt="" className={LobbyPresenceModule.rankIcon} />
            <div className={LobbyPresenceModule.riotID}>{props.riotID}</div>
            <div className={LobbyPresenceModule.tag}>{`#${props.tag}`}</div>
            <hr className={LobbyPresenceModule.line} />
            {props.isAFK ? <div className={LobbyPresenceModule.state}>{`In Lobby(AFK)`}</div> :
                <div className={LobbyPresenceModule.state}>{`In Lobby(Active)`}</div>
            }
            <div className={LobbyPresenceModule.partyIcon}>
                <span className="material-icons md-24">{partyIconName}</span>
            </div>
            <button className={LobbyPresenceModule.button} onClick={() => props.onClick({isOpen: true, riotID: props.riotID, tag: props.tag, puuid: props.puuid, rankNum: props.rankNum, cardId: props.card})}></button>
        </div>
    );
}

export default LobbyPresence;