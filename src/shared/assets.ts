export const rankUrl = (rankNum: number): string => {
    const rankNumString = rankNum.toString();
    const rankurl = `https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/${rankNumString}/smallicon.png`;
    //const rankurl = `file:///assets/rank/${rankNumString}.png`;
    return rankurl;
}

export const mapUrl = (mapName: string): string => {
    if (mapName === 'Ascent') return 'https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/listviewicon.png';
    else if (mapName === 'Split') return 'https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/listviewicon.png';
    else if (mapName === 'Fracture') return 'https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/listviewicon.png';
    else if (mapName === 'Bind') return 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/listviewicon.png';
    else if (mapName === 'Breeze') return 'https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/listviewicon.png';
    else if (mapName === 'Icebox') return 'https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/listviewicon.png';
    else if (mapName === 'Haven') return 'https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/listviewicon.png';
    else if (mapName === 'Pearl') return 'https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/listviewicon.png';
    else if (mapName === 'ShootingRange') return 'https://media.valorant-api.com/maps/ee613ee9-28b7-4beb-9666-08db13bb2244/listviewicon.png';
    return '';
}

export const frameUrl = (frameuuid: string): string => {
    if (frameuuid === '') return 'https://media.valorant-api.com/levelborders/ebc736cd-4b6a-137b-e2b0-1486e31312c9/smallplayercardappearance.png';
    else return `https://media.valorant-api.com/levelborders/${frameuuid}/smallplayercardappearance.png`;
}

export const cardUrl = (carduuid: string): string => {
    return `https://media.valorant-api.com/playercards/${carduuid}/displayicon.png`;
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