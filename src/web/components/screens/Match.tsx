import React from "react";
import { charaUrl, mapUrl } from "../../../shared/assets";

import MatchesModule from '../../../styles/Match.module.css';

const Match: React.FC<MatchDetail> = (props) => {
    const mapImageUrl = mapUrl(props.map);
    const charaImageUrl = charaUrl(props.charaId);
    if (props.isWin === true) {
        return (
            <div className={MatchesModule.matchWin}>
                <img src={mapImageUrl} alt="" className={MatchesModule.mapImage} />
                <div className={MatchesModule.gradientBoxWin}>
                    <img src={charaImageUrl} alt="" className={MatchesModule.charaIcon} />
                    <div className={MatchesModule.mapName}>{props.map}</div>
                    <div className={MatchesModule.score}>{props.score}</div>
                    <div className={MatchesModule.kda}>{props.kda}</div>
                    {props.isMatchMVP === true ?
                        <div className={MatchesModule.matchMVP}>Match MVP</div>
                        : (props.isTeamMVP === true ?
                            <div className={MatchesModule.teamMVP}>Team MVP</div>
                            : <div></div>)
                    }
                </div>
            </div>
        );
    } else {
        return (
            <div className={MatchesModule.matchLose}>
                <img src={mapImageUrl} alt="" className={MatchesModule.mapImage} />
                <div className={MatchesModule.gradientBoxLose}>
                    <img src={charaImageUrl} alt="" className={MatchesModule.charaIcon} />
                    <div className={MatchesModule.mapName}>{props.map}</div>
                    <div className={MatchesModule.score}>{props.score}</div>
                    <div className={MatchesModule.kda}>{props.kda}</div>
                    {props.isMatchMVP === true ?
                        <div className={MatchesModule.matchMVP}>Match MVP</div>
                        : (props.isTeamMVP === true ?
                            <div className={MatchesModule.teamMVP}>Team MVP</div>
                            : <div></div>)
                    }
                </div>
            </div>
        );
    }
}

export default Match;