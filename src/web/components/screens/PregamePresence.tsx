import React from "react";

import { rankUrl, partyIcons, mapUrl, frameUrl, cardUrl } from "../../../shared/assets";
import PregamePresenceModule from '../../../styles/PregamePresence.module.css';

const PregamePresence: React.FC<PregameRes> = (props) => {
    const rankIconUrl = rankUrl(props.rankNum);
    const mapImageUrl = mapUrl(props.map);
    const frameImageUrl = frameUrl(props.frame);
    const cardImageUrl = cardUrl(props.card);
    const partyIconName = partyIcons(props.partyIconNum);
    return (
        <div className={PregamePresenceModule.presence}>
            <img src={mapImageUrl} alt="" className={PregamePresenceModule.mapImage} />
            <div className={PregamePresenceModule.gradientBox}>
                <img src={frameImageUrl} alt="" className={PregamePresenceModule.cardFrame} />
                <img src={cardImageUrl} alt="" className={PregamePresenceModule.playerCard} />
                <img src={rankIconUrl} alt="" className={PregamePresenceModule.rankIcon} />
                <div className={PregamePresenceModule.riotID}>{props.riotID}</div>
                <div className={PregamePresenceModule.tag}>{`#${props.tag}`}</div>
                <hr className={PregamePresenceModule.line} />
                <div className={PregamePresenceModule.modeText}>{props.mode}</div>
                <div className={PregamePresenceModule.mapName}>{props.map}</div>
                <div className={PregamePresenceModule.partyIcon}>
                    <span className="material-icons md-24">{partyIconName}</span>
                </div>
            </div>
            <button className={PregamePresenceModule.button} onClick={() => props.onClick({isOpen: true, riotID: props.riotID, tag: props.tag, puuid: props.puuid, rankNum: props.rankNum, cardId: props.card})}></button>
        </div>
    );
}

export default PregamePresence;