import React from "react";

import { rankUrl, partyIcons, mapUrl, frameUrl, cardUrl } from "../../../shared/assets";
import PresenceModule from '../../../styles/Presence.module.css';

const Presence: React.FC<GameRes> = (props) => {
    const rankIconUrl = rankUrl(props.rankNum);
    const mapImageUrl = mapUrl(props.map);
    const frameImageUrl = frameUrl(props.frame);
    const cardImageUrl = cardUrl(props.card);
    const partyIconName = partyIcons(props.partyIconNum);
    return (
        <div className={PresenceModule.presence}>
            <img src={mapImageUrl} alt="" className={PresenceModule.mapImage} />
            <div className={PresenceModule.gradientBox}>
                <img src={frameImageUrl} alt="" className={PresenceModule.cardFrame} />
                <img src={cardImageUrl} alt="" className={PresenceModule.playerCard} />
                <img src={rankIconUrl} alt="" className={PresenceModule.rankIcon} />
                <div className={PresenceModule.riotID}>{props.riotID}</div>
                <div className={PresenceModule.tag}>{`#${props.tag}`}</div>
                <hr className={PresenceModule.line} />
                <div className={PresenceModule.modeText}>{props.mode}</div>
                <div className={PresenceModule.mapName}>{props.map}</div>
                <div className={PresenceModule.score}>{props.score}</div>
                <div className={PresenceModule.partyIcon}>
                    <span className="material-icons md-24">{partyIconName}</span>
                </div>
            </div>
            <button className={PresenceModule.button} onClick={() => props.onClick({isOpen: true, riotID: props.riotID, tag: props.tag, puuid: props.puuid, rankNum: props.rankNum, cardId: props.card})}></button>
        </div>
    );
}

export default Presence;