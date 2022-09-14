export enum IPCChannelType {
    SendIDPass = 'send-id-pass',
    Send2FACode = 'send-2fa-code',
    SendPresences = 'send-presences',
    Relaunch = 'relaunch',
    StartXmppClient = 'start-xmpp-client',
    EndXmppClient = 'end-xmpp-client',
    DebugEndpoint = 'debug-endpoint',
    Reauth = 'reauth',
    FetchMatchHistory = 'fetch-match-history',
}