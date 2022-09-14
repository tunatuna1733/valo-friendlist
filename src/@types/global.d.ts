declare type ValoAuthRes = {
    success: boolean;
    twofa?: boolean;
    debuginfo?: any;
    error?: string;
    detail?: any;
    ssid?: string;
}

declare type GameRes = {
    state: string;
    puuid: string;
    rankNum: number;
    riotID: string;
    tag: string;
    mode: string;
    map: string;
    score: string;
    frame: string;
    card: string;
    partyIconNum: number;
    lastModified: number;
    onClick: (options: ModalOptions) => void;
}

declare type LobbyRes = {
    state: string;
    puuid: string;
    rankNum: number;
    riotID: string;
    tag: string;
    isAFK: boolean;
    frame: string;
    card: string;
    partyIconNum: number;
    lastModified: number;
    onClick: (options: ModalOptions) => void;
}

declare type PregameRes = {
    state: string;
    puuid: string;
    rankNum: number;
    riotID: string;
    tag: string;
    mode: string;
    map: string;
    frame: string;
    card: string;
    partyIconNum: number;
    lastModified: number;
    onClick: (options: ModalOptions) => void;
}

declare type PresenceRes = {
    presences: (GameRes | LobbyRes | PregameRes)[]
}

declare type MatchDetail = {
    charaId: string;
    kda: string;
    isMatchMVP: boolean;
    isTeamMVP: boolean;
    score: string;
    map: string;
    isWin: boolean;
}

declare type ModalOptions = {
    isOpen: boolean;
    riotID: string;
    tag: string;
    puuid: string;
    rankNum: number;
}

declare module '*.css' {
    interface IClassNames {
      [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}
