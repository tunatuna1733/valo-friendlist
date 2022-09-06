export const rankUrl = (rankNum: number): string => {
    const rankNumString = rankNum.toString();
    const rankurl = `https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/${rankNumString}/smallicon.png`;
    //const rankurl = `file:///assets/rank/${rankNumString}.png`;
    return rankurl;
}

export const partyIcons = (partyIconNum: number): string => {
    const list = ['', 'circle', 'square', 'change_history', 'star_outline', 'favorite_border', 'dark_mode', 'pentagon', 'hexagon'];
    return list[partyIconNum];
}

export const convertMap = (mapId: string): string => {
    if (mapId === '/Game/Maps/Ascent/Ascent') return 'Ascent';
    else if (mapId === '/Game/Maps/Bonsai/Bonsai') return 'Split';
    else if (mapId === '/Game/Maps/Canyon/Canyon') return 'Fracture';
    else if (mapId === '/Game/Maps/Duality/Duality') return 'Bind';
    else if (mapId === '/Game/Maps/Foxtrot/Foxtrot') return 'Breeze';
    else if (mapId === '/Game/Maps/Port/Port') return 'Icebox';
    else if (mapId === '/Game/Maps/Triad/Triad') return 'Haven';
    else if (mapId === '/Game/Maps/Pitt/Pitt') return 'Pearl';
    return '';
}

export const convertMode = (modeId: string): string => {
    if (modeId === 'newmap') return 'New Map';
    else if (modeId === 'competitive') return 'Competitive';
    else if (modeId === 'unrated') return 'Unrated';
    else if (modeId === 'spikerush') return 'Spike Rush';
    else if (modeId === 'deathmatch') return 'DeathMatch';
    else if (modeId === 'ggteam') return 'Escalation';
    else if (modeId === 'onefa') return 'Replication';
    else if (modeId === 'snowball') return 'SnowBall Fight';
    else return 'Custom';
}