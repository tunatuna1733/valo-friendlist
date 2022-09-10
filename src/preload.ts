import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPCChannelType } from './shared/channels';

contextBridge.exposeInMainWorld('myAPI', {
    sendIDPass: async (riotID: string, password: string): Promise<ValoAuthRes> => ipcRenderer.invoke(IPCChannelType.SendIDPass, riotID, password),
    send2FACode: async (twoFACode: string): Promise<ValoAuthRes> => ipcRenderer.invoke(IPCChannelType.Send2FACode, twoFACode),
    sendPresences: (listener: (presence: PresenceRes) => void) => {
        ipcRenderer.on(IPCChannelType.SendPresences, (event: IpcRendererEvent, presence: PresenceRes) => listener(presence))
    },
    relaunch: async (): Promise<void> => ipcRenderer.invoke(IPCChannelType.Relaunch),
    startXmppClient: async (): Promise<string> => ipcRenderer.invoke(IPCChannelType.StartXmppClient),
    endXmppClient: async (): Promise<void> => ipcRenderer.invoke(IPCChannelType.EndXmppClient),
    reauth: async (): Promise<string> => ipcRenderer.invoke(IPCChannelType.Reauth),
    debugEndpoint: async (): Promise<any> => ipcRenderer.invoke(IPCChannelType.DebugEndpoint),
});