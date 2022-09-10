import path from 'path';
import { BrowserWindow, app, session, ipcMain } from 'electron';
import { searchDevtools } from 'electron-search-devtools';
import ElectronStore from 'electron-store';
import * as dotenv from 'dotenv';
import { IPCChannelType } from './shared/channels';
import { ValoAuth } from './utils/valoauth';
import { Builders, ValorantXmppClient } from 'valorant-xmpp-client';
import { puuidToName } from './utils/nameservice';
import { convertMap, convertMode } from './shared/assets';

dotenv.config();

const { PresenceBuilder, KeystonePresenceBuilder } = Builders;
const store = new ElectronStore({ encryptionKey: process.env.ENCRYPTION_KEY, name: 'FriendListClientSecret' });
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.resolve(
            __dirname,
            process.platform === 'win32'
                ? '../node_modules/electron/dist/electron.exe'
                : '../node_modules/.bin/electron'
        ),
    });
}

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 360,
        height: 640,
        useContentSize: true,
        maximizable: false,
        // frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            spellcheck: false,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false  // for debug only
        }
    })
    mainWindow.loadFile('dist/index.html');

    process.traceProcessWarnings = true;

    if (isDev) {
        searchDevtools('REACT').then((devtools) => {
            session.defaultSession.loadExtension(devtools, { allowFileAccess: true });
        });
    }

    mainWindow.on('closed', () => {
        session.defaultSession.clearCache();
    });

    const valoauth = new ValoAuth();
    const xmppClient = new ValorantXmppClient();
    xmppClient.presence = new PresenceBuilder().addKeystonePresence(new KeystonePresenceBuilder());
    let rawPresences: any[] = [];
    let presenceData = {};
    xmppClient.on('presence', async (presence) => {
        // edit presence list and send to renderer
        let partyIds: any[] = [];
        const unix = Date.now();
        if (presence.sender.local === presence.recipient.local) return;
        for (const game of presence.gamePresence) {
            if (game.type === 'valorant') {
                const puuid = presence.sender.local;
                for (const presence of rawPresences) {
                    if (presence.puuid === puuid) {
                        rawPresences.splice(rawPresences.indexOf(presence), 1);
                    }
                }
                const res = await puuidToName(puuid);
                const name = res.data[0].GameName;
                const tag = res.data[0].TagLine;
                const state = game.presence.sessionLoopState;
                if (state === 'INGAME') {
                    if (game.presence.provisioningFlow !== 'ShootingRange') {
                        const map = convertMap(game.presence.matchMap);
                        const score = game.presence.partyOwnerMatchScoreAllyTeam.toString() + ' - ' + game.presence.partyOwnerMatchScoreEnemyTeam.toString();
                        let mode = convertMode(game.presence.queueId);
                        if (game.presence.provisioningFlow === 'CustomGame') mode = 'Custom';
                        const partyId = game.presence.partyId;
                        const rankNum = game.presence.competitiveTier;
                        let copydata = {};
                        presenceData = {
                            state: 'ingame',
                            puuid: puuid,
                            rankNum: rankNum,
                            riotID: name,
                            tag: tag,
                            mode: mode,
                            map: map,
                            score: score,
                            frame: game.presence.preferredLevelBorderId,
                            card: game.presence.playerCardId,
                            partyId: partyId,
                            partyIconNum: 0,
                            lastModified: unix
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    } else {
                        const map = 'ShootingRange';
                        const score = '';
                        const mode = ''
                        const partyId = game.presence.partyId;
                        const rankNum = game.presence.competitiveTier;
                        let copydata = {};
                        presenceData = {
                            state: 'ingame',
                            puuid: puuid,
                            rankNum: rankNum,
                            riotID: name,
                            tag: tag,
                            mode: mode,
                            map: map,
                            score: score,
                            frame: game.presence.preferredLevelBorderId,
                            card: game.presence.playerCardId,
                            partyId: partyId,
                            partyIconNum: 0,
                            lastModified: unix
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    }
                } else if (state === 'MENUS') {
                    const partyId = game.presence.partyId;
                    const rankNum = game.presence.competitiveTier;
                    let copydata = {}
                    if (game.presence.isIdle === false) {
                        presenceData = {
                            state: 'menu',
                            puuid: puuid,
                            rankNum: rankNum,
                            riotID: name,
                            tag: tag,
                            isAFK: false,
                            frame: game.presence.preferredLevelBorderId,
                            card: game.presence.playerCardId,
                            partyId: partyId,
                            partyIconNum: 0,
                            lastModified: unix
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    } else {
                        presenceData = {
                            state: 'menu',
                            puuid: puuid,
                            rankNum: rankNum,
                            riotID: name,
                            tag: tag,
                            isAFK: true,
                            frame: game.presence.preferredLevelBorderId,
                            card: game.presence.playerCardId,
                            partyId: partyId,
                            partyIconNum: 0,
                            lastModified: unix
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    }
                } else if (state === 'PREGAME') {
                    const partyId = game.presence.partyId;
                    const rankNum = game.presence.competitiveTier;
                    const map = convertMap(game.presence.matchMap);
                    let mode = convertMode(game.presence.queueId);
                    if (game.presence.provisioningFlow === 'CustomGame') mode = 'Custom';
                    let copydata = {};
                    presenceData = {
                        state: 'pregame',
                        puuid: puuid,
                        rankNum: rankNum,
                        riotID: name,
                        tag: tag,
                        mode: mode,
                        map: map,
                        frame: game.presence.preferredLevelBorderId,
                        card: game.presence.playerCardId,
                        partyId: partyId,
                        partyIconNum: 0,
                        lastModified: unix
                    };
                    rawPresences.push(Object.assign(copydata, presenceData));
                }
            }
        }

        for (const presence of rawPresences) {
            partyIds.push(presence.partyId);
        }
        const dupePartyIds = partyIds.filter(function (val, i, array) {
            return !(array.indexOf(val) === i);
        });

        let partyNum = 1;
        for (const dupePartyId of dupePartyIds) {
            for (const presence of rawPresences) {
                if (presence.partyId === dupePartyId) {
                    presence.partyIconNum = partyNum;
                }
            }
            partyNum++;
        }

        rawPresences = Array.from(new Map(rawPresences.map((rawPresence) => [rawPresence.puuid, rawPresence])).values());

        rawPresences = rawPresences.sort((a, b) => {
            if (a.partyId < b.partyId) return -1;
            else if (a.partyId > b.partyId) return 1;
            else return 0;
        });

        for (const presence of rawPresences) {
            if (unix - presence.lastModified > 300000 && presence.state === 'menu') {
                rawPresences.splice(rawPresences.indexOf(presence), 1);
            }
        }

        const data = {
            presences: rawPresences
        };

        console.dir(data, { depth: null });

        mainWindow.webContents.send(IPCChannelType.SendPresences, data);
    });

    xmppClient.on('error', (error) => {
        console.error(error);
    });

    ipcMain.handle(IPCChannelType.SendIDPass, async (event, riotID, password) => {
        valoauth.setCredentials(riotID, password);
        const result = await valoauth.step1();
        if (result.twofa === false) {
            store.set('ssid', result.ssid);
        }
        return result;
    });

    ipcMain.handle(IPCChannelType.Send2FACode, async (event, twoFACode) => {
        const result = await valoauth.step2(twoFACode);
        store.set('ssid', result.ssid);
        return result;
    });

    ipcMain.handle(IPCChannelType.Relaunch, async (event) => {
        app.relaunch();
        app.exit(0);
    });

    ipcMain.handle(IPCChannelType.StartXmppClient, async (event) => {
        const accessToken = valoauth.getAccessToken();
        if (accessToken === undefined) return new Promise((resolve) => {
            resolve('Not ready');
        });
        xmppClient.login({ accessToken: accessToken });
        return new Promise((resolve) => {
            xmppClient.once('ready', () => {
                resolve('ready');
            });
        });
    });

    ipcMain.handle(IPCChannelType.EndXmppClient, async (event) => {
        xmppClient.end();
        //xmppClient = new ValorantXmppClient();
        xmppClient.presence = new PresenceBuilder().addKeystonePresence(new KeystonePresenceBuilder());
        xmppClient.on('presence', async (presence) => {
            // edit presence list and send to renderer
            let partyIds: any[] = [];
            const unix = Date.now();
            if (presence.sender.local === presence.recipient.local) return;
            for (const game of presence.gamePresence) {
                if (game.type === 'valorant') {
                    const puuid = presence.sender.local;
                    for (const presence of rawPresences) {
                        if (presence.puuid === puuid) {
                            rawPresences.splice(rawPresences.indexOf(presence), 1);
                        }
                    }
                    const res = await puuidToName(puuid);
                    const name = res.data[0].GameName;
                    const tag = res.data[0].TagLine;
                    const state = game.presence.sessionLoopState;
                    if (state === 'INGAME') {
                        if (game.presence.provisioningFlow !== 'ShootingRange') {
                            const map = convertMap(game.presence.matchMap);
                            const score = game.presence.partyOwnerMatchScoreAllyTeam.toString() + ' - ' + game.presence.partyOwnerMatchScoreEnemyTeam.toString();
                            let mode = convertMode(game.presence.queueId);
                            if (game.presence.provisioningFlow === 'CustomGame') mode = 'Custom';
                            const partyId = game.presence.partyId;
                            const rankNum = game.presence.competitiveTier;
                            let copydata = {};
                            presenceData = {
                                state: 'ingame',
                                puuid: puuid,
                                rankNum: rankNum,
                                riotID: name,
                                tag: tag,
                                mode: mode,
                                map: map,
                                score: score,
                                frame: game.presence.preferredLevelBorderId,
                                card: game.presence.playerCardId,
                                partyId: partyId,
                                partyIconNum: 0,
                                lastModified: unix
                            };
                            rawPresences.push(Object.assign(copydata, presenceData));
                        } else {
                            const map = 'ShootingRange';
                            const score = '';
                            const mode = ''
                            const partyId = game.presence.partyId;
                            const rankNum = game.presence.competitiveTier;
                            let copydata = {};
                            presenceData = {
                                state: 'ingame',
                                puuid: puuid,
                                rankNum: rankNum,
                                riotID: name,
                                tag: tag,
                                mode: mode,
                                map: map,
                                score: score,
                                frame: game.presence.preferredLevelBorderId,
                                card: game.presence.playerCardId,
                                partyId: partyId,
                                partyIconNum: 0,
                                lastModified: unix
                            };
                            rawPresences.push(Object.assign(copydata, presenceData));
                        }
                    } else if (state === 'MENUS') {
                        const partyId = game.presence.partyId;
                        const rankNum = game.presence.competitiveTier;
                        let copydata = {}
                        if (game.presence.isIdle === false) {
                            presenceData = {
                                state: 'menu',
                                puuid: puuid,
                                rankNum: rankNum,
                                riotID: name,
                                tag: tag,
                                isAFK: false,
                                frame: game.presence.preferredLevelBorderId,
                                card: game.presence.playerCardId,
                                partyId: partyId,
                                partyIconNum: 0,
                                lastModified: unix
                            };
                            rawPresences.push(Object.assign(copydata, presenceData));
                        } else {
                            presenceData = {
                                state: 'menu',
                                puuid: puuid,
                                rankNum: rankNum,
                                riotID: name,
                                tag: tag,
                                isAFK: true,
                                frame: game.presence.preferredLevelBorderId,
                                card: game.presence.playerCardId,
                                partyId: partyId,
                                partyIconNum: 0,
                                lastModified: unix
                            };
                            rawPresences.push(Object.assign(copydata, presenceData));
                        }
                    } else if (state === 'PREGAME') {
                        const partyId = game.presence.partyId;
                        const rankNum = game.presence.competitiveTier;
                        const map = convertMap(game.presence.matchMap);
                        let mode = convertMode(game.presence.queueId);
                        if (game.presence.provisioningFlow === 'CustomGame') mode = 'Custom';
                        let copydata = {};
                        presenceData = {
                            state: 'pregame',
                            puuid: puuid,
                            rankNum: rankNum,
                            riotID: name,
                            tag: tag,
                            mode: mode,
                            map: map,
                            frame: game.presence.preferredLevelBorderId,
                            card: game.presence.playerCardId,
                            partyId: partyId,
                            partyIconNum: 0,
                            lastModified: unix
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    }
                }
            }
    
            for (const presence of rawPresences) {
                partyIds.push(presence.partyId);
            }
            const dupePartyIds = partyIds.filter(function (val, i, array) {
                return !(array.indexOf(val) === i);
            });
    
            let partyNum = 1;
            for (const dupePartyId of dupePartyIds) {
                for (const presence of rawPresences) {
                    if (presence.partyId === dupePartyId) {
                        presence.partyIconNum = partyNum;
                    }
                }
                partyNum++;
            }
    
            rawPresences = Array.from(new Map(rawPresences.map((rawPresence) => [rawPresence.puuid, rawPresence])).values());
    
            rawPresences = rawPresences.sort((a, b) => {
                if (a.partyId < b.partyId) return -1;
                else if (a.partyId > b.partyId) return 1;
                else return 0;
            });

            for (const presence of rawPresences) {
                if (unix - presence.lastModified > 300000 && presence.state === 'menu') {
                    rawPresences.splice(rawPresences.indexOf(presence), 1);
                }
            }
    
            const data = {
                presences: rawPresences
            };
    
            console.dir(data, { depth: null });
    
            mainWindow.webContents.send(IPCChannelType.SendPresences, data);
        });
    });

    ipcMain.handle(IPCChannelType.Reauth, async (event) => {
        const ssidCookie = store.get('ssid', 'None');
        if (ssidCookie === 'None') {
            return ('Not ready');
        }
        if (typeof ssidCookie === 'string') {
            console.log(ssidCookie);
            return valoauth.reauth(ssidCookie).then(async (result) => {
                store.set('ssid', result.ssid);
                const accessToken = valoauth.getAccessToken();
                console.log(accessToken);
                if (accessToken === undefined) return ('Not ready');
                try {
                    await xmppClient.login({ accessToken: accessToken });
                } catch (e) {
                    console.log('xmpp login error', e);
                }
                return ('ready');
            });
            
        }
    });

    ipcMain.handle(IPCChannelType.DebugEndpoint, async (event) => {
        /*await xmppClient.fetchFriends();
        xmppClient.on('roster', (roster) => {
            console.dir(roster, { depth: null });
        });*/
    });
});

app.once('window-all-closed', () => {
    app.quit()
});

