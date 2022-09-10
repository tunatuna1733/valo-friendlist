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
}

declare type PresenceRes = {
    presences: (GameRes | LobbyRes | PregameRes)[]
}

declare module '*.css' {
    interface IClassNames {
      [className: string]: string
    }
    const classNames: IClassNames;
    export = classNames;
}
