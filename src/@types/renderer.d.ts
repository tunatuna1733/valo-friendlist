export interface IMyAPI {
    sendIDPass: (riotID: string, password: string) => Promise<ValoAuthRes>,
    send2FACode: (twoFACode: string) => Promise<ValoAuthRes>,
    relaunch: () => Promise<void>,
    startXmppClient: () => Promise<string>,
    endXmppClient: () => Promise<void>,
    sendPresences: (listener: (presence: PresenceRes) => void) => void,
    debugEndpoint: () => any,
}

declare global {
    interface Window {
        myAPI: IMyAPI;
    }
}