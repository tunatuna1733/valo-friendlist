import React, { useEffect, useState } from "react";
import { rankUrl } from "../../../shared/assets";

import CareerModalModule from '../../../styles/CareerModal.module.css';
import Match from "./Match";

const { myAPI } = window;

type Props = {
    riotID: string;
    tag: string;
    puuid: string;
    rankNum: number;
    handleModal: () => void;
}

const CareerModal: React.FC<Props> = (props) => {
    const [matchList, setMatchList] = useState<MatchDetail[]>();
    useEffect(() => {
        (async () => {
            myAPI.fetchMatchHistory(props.puuid).then((data) => {
                setMatchList(data);
            })
        })();
    }, []);

    useEffect(() => {
        console.log(matchList);
    }, [matchList]);

    const rankIconUrl = rankUrl(props.rankNum);

    return (
        <div className={CareerModalModule.container}>
            <button className={CareerModalModule.closeButton} onClick={props.handleModal}>✕</button>
            <div className={CareerModalModule.riotID}>
                {props.riotID}
            </div>
            <div className={CareerModalModule.tag}>
                {props.tag}
            </div>
            <hr className={CareerModalModule.line} />
            <div className={CareerModalModule.currentRank}>Current Rank</div>
            <img src={rankIconUrl} alt="" className={CareerModalModule.rankIcon} />
            <div className={CareerModalModule.matches}>
                {typeof matchList !== 'undefined' ?
                    // matches
                    matchList.map((matchDetail, i) => {
                        return (<Match charaId={matchDetail.charaId} kda={matchDetail.kda} isMatchMVP={matchDetail.isMatchMVP} isTeamMVP={matchDetail.isTeamMVP} score={matchDetail.score} map={matchDetail.map} isWin={matchDetail.isWin} key={i} />);
                    })
                    : <h1>Loading...</h1>
                }
            </div>
        </div>
    );
}

export default CareerModal;