import React from "react";

import { rankUrl, partyIcons } from "../../../shared/assets";
import PresenceModule from './Presence.module.css';

const Presence: React.FC<GameRes> = (props) => {
    const rankIconUrl = rankUrl(props.rankNum);
    const partyIconName = partyIcons(props.partyIconNum);
    console.log(props);
    return (
        <div className={PresenceModule.presence}>
            <img src={rankIconUrl} alt="" className={PresenceModule.rankIcon} />
            <div className={PresenceModule.riotID}>{props.riotID}</div>
            <div className={PresenceModule.tag}>{`#${props.tag}`}</div>
            <hr className={PresenceModule.line} />
            <div className={PresenceModule.modeText}>{props.mode}</div>
            <div className={PresenceModule.mapName}>{props.map}</div>
            <div className={PresenceModule.score}>{props.score}</div>
            <div className={PresenceModule.partyIcon}>
                <span className="material-icons-outlined md-24">{partyIconName}</span>
            </div>
        </div>
    );
}

export default Presence;