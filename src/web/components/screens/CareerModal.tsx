import React, { useEffect, useState } from "react";
import { cardUrl, frameUrl, rankUrl } from "../../../shared/assets";

import CareerModalModule from '../../../styles/CareerModal.module.css';
import Match from "./Match";

const { myAPI } = window;

type Props = {
    riotID: string;
    tag: string;
    puuid: string;
    rankNum: number;
    cardId: string;
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
    const frameImageUrl = frameUrl('');
    const cardImageUrl = cardUrl(props.cardId);

    return (
        <div className={CareerModalModule.container}>
            <button className={CareerModalModule.closeButton} onClick={props.handleModal}>✕</button>
            <img src={frameImageUrl} alt="" className={CareerModalModule.cardFrame} />
            <img src={cardImageUrl} alt="" className={CareerModalModule.playerCard} />
            <div className={CareerModalModule.riotID}>
                {props.riotID}
            </div>
            <div className={CareerModalModule.tag}>
                {`#${props.tag}`}
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