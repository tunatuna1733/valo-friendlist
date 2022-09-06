export const isGameRes = (params: unknown): params is GameRes => {
    const gameRes = params as GameRes;

    return gameRes.state === 'ingame';
    /*
    return (
        typeof gameRes?.state === 'string' &&
        typeof gameRes?.puuid === 'string' &&
        typeof gameRes?.rankNum === 'number' &&
        typeof gameRes?.riotID === 'string' &&
        typeof gameRes?.tag === 'string' &&
        typeof gameRes?.mode === 'string' &&
        typeof gameRes?.map === 'string' &&
        typeof gameRes?.score === 'string' &&
        typeof gameRes?.partyIconNum === 'number'
    );
    */
};

export const isLobbyRes = (params: unknown): params is LobbyRes => {
    const lobbyRes = params as LobbyRes;

    return lobbyRes.state === 'menu';
    /*
    return (
        typeof lobbyRes?.state === 'string' &&
        typeof lobbyRes?.puuid === 'string' &&
        typeof lobbyRes?.rankNum === 'number' &&
        typeof lobbyRes?.riotID === 'string' &&
        typeof lobbyRes?.tag === 'string' &&
        typeof lobbyRes?.isAFK === 'boolean' &&
        typeof lobbyRes?.partyIconNum === 'number'
    );
    */
};

export const isPregameRes = (params: unknown): params is PregameRes => {
    const pregameRes = params as PregameRes;

    return pregameRes.state === 'pregame';
    /*
    return (
        typeof pregameRes?.state === 'string' &&
        typeof pregameRes?.puuid === 'string' &&
        typeof pregameRes?.rankNum === 'number' &&
        typeof pregameRes?.riotID === 'string' &&
        typeof pregameRes?.tag === 'string' &&
        typeof pregameRes?.mode === 'string' &&
        typeof pregameRes?.map === 'string' &&
        typeof pregameRes?.partyIconNum === 'number'
    );
    */
};