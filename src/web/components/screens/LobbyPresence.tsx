import React from "react";

import { rankUrl, partyIcons } from "../../../shared/assets";
import LobbyPresenceModule from './LobbyPresence.module.css';

const LobbyPresence: React.FC<LobbyRes> = (props) => {
    const rankIconUrl = rankUrl(props.rankNum);
    const partyIconName = partyIcons(props.partyIconNum);
    return (
        <div className={LobbyPresenceModule.presence}>
            <img src={rankIconUrl} alt="" className={LobbyPresenceModule.rankIcon} />
            <div className={LobbyPresenceModule.riotID}>{props.riotID}</div>
            <div className={LobbyPresenceModule.tag}>{`#${props.tag}`}</div>
            <hr className={LobbyPresenceModule.line} />
            {props.isAFK ? <div className={LobbyPresenceModule.state}>{`In Lobby(AFK)`}</div> :
                <div className={LobbyPresenceModule.state}>{`In Lobby(Active)`}</div>
            }
            <div className={LobbyPresenceModule.partyIcon}>
                <span className="material-icons-outlined md-24">{partyIconName}</span>
            </div>
        </div>
    );
}

export default LobbyPresence;