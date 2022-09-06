import path from 'path';
import { BrowserWindow, app, session, ipcMain } from 'electron';
import { searchDevtools } from 'electron-search-devtools';
import { IPCChannelType } from './shared/channels';
import { ValoAuth } from './utils/valoauth';
import { Builders, ValorantXmppClient } from 'valorant-xmpp-client';
import { puuidToName } from './utils/nameservice';
import { convertMap, convertMode } from './shared/assets';

const { PresenceBuilder, KeystonePresenceBuilder } = Builders;
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

    if (isDev) {
        searchDevtools('REACT').then((devtools) => {
            session.defaultSession.loadExtension(devtools, { allowFileAccess: true });
        });
    }

    const valoauth = new ValoAuth();
    const xmppClient = new ValorantXmppClient();
    xmppClient.presence = new PresenceBuilder().addKeystonePresence(new KeystonePresenceBuilder());
    let rawPresences: any[] = [];
    let presenceData = {};
    xmppClient.on('presence', async (presence) => {
        // edit presence list and send to renderer
        let partyIds: any[] = [];
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
                console.log(res);
                const name = res.data[0].GameName;
                const tag = res.data[0].TagLine;
                const state = game.presence.sessionLoopState;
                let memoPartyId;
                if (state === 'INGAME') {
                    if (game.presence.provisioningFlow !== 'ShootingRange') {
                        const map = convertMap(game.presence.matchMap);
                        const score = game.presence.partyOwnerMatchScoreAllyTeam.toString() + ' - ' + game.presence.partyOwnerMatchScoreEnemyTeam.toString();
                        let mode = convertMode(game.presence.queueId);
                        if (game.presence.provisioningFlow === 'CustomGame') mode = 'Custom';
                        const partyId = game.presence.partyId;
                        memoPartyId = partyId;
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
                            partyId: partyId,
                            partyIconNum: 0
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    } else {
                        const map = 'ShootingRange';
                        const score = '';
                        const mode = ''
                        const partyId = game.presence.partyId;
                        memoPartyId = partyId;
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
                            partyId: partyId,
                            partyIconNum: 0
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    }
                } else if (state === 'MENUS') {
                    const partyId = game.presence.partyId;
                    memoPartyId = partyId;
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
                            partyId: partyId,
                            partyIconNum: 0
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    } else {
                        presenceData = {
                            state: 'menu',
                            puuid: puuid,
                            rankNum: rankNum,
                            riotID: name,
                            tag: tag,
                            isAFK: false,
                            partyId: partyId,
                            partyIconNum: 0
                        };
                        rawPresences.push(Object.assign(copydata, presenceData));
                    }
                } else if (state === 'PREGAME') {
                    const partyId = game.presence.partyId;
                    memoPartyId = partyId;
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
                        partyId: partyId,
                        partyIconNum: 0
                    };
                    rawPresences.push(Object.assign(copydata, presenceData));
                }
                partyIds.push(memoPartyId);
            }
        }

        const getDuplicateValues = (array: any[]) => {
            return array.filter((value, index, self) => self.indexOf(value) === index && self.lastIndexOf(value) !== index);
        }
        const dupePartyIds = getDuplicateValues(partyIds);
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

        const data = {
            presences: rawPresences
        };

        mainWindow.webContents.send(IPCChannelType.SendPresences, data);
    });

    xmppClient.on('error', (error) => {
        console.error(error);
    });

    ipcMain.handle(IPCChannelType.SendIDPass, async (event, riotID, password) => {
        valoauth.setCredentials(riotID, password);
        const result = valoauth.step1();
        return result;
    });

    ipcMain.handle(IPCChannelType.Send2FACode, async (event, twoFACode) => {
        const result = valoauth.step2(twoFACode);
        return result;
    });

    ipcMain.handle(IPCChannelType.Relaunch, async (event) => {
        app.relaunch();
        app.exit(0);
    });

    ipcMain.handle(IPCChannelType.StartXmppClient, async (event) => {
        const accessToken = valoauth.getAccessToken();
        xmppClient.login({ accessToken: accessToken });
        return new Promise((resolve) => {
            xmppClient.once('ready', () => {
                resolve('ready');
            });
        });
    });

    ipcMain.handle(IPCChannelType.EndXmppClient, async (event) => {
        xmppClient.end();
    });

    ipcMain.handle(IPCChannelType.DebugEndpoint, async (event) => {
        await xmppClient.fetchFriends();
        xmppClient.on('roster', (roster) => {
            console.dir(roster, { depth: null });
        })
    });
});

app.once('window-all-closed', () => app.quit());

