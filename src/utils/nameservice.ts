import axios from "axios";

export const puuidToName = async (puuid: string | undefined): Promise<any> => {
    return axios.put('https://pd.ap.a.pvp.net/name-service/v2/players', [puuid]);
}