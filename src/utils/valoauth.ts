import { Agent } from 'https';
const axios = require('axios').default;

export class ValoAuth {
    private useragent: string;
    constructor() {}
    private username: string;
    private password: string;
    private session: any;
    private tokens: any = new Object();
    private headers: any = new Object();
    private ssidCookie: string;
    private asidCookie: string;
    private clientVersion: string;
    private region: string;

    private ciphers = [
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256'
    ];
    private agent = new Agent({
        ciphers: this.ciphers.join(':'),
        honorCipherOrder: true,
        minVersion: 'TLSv1.2'
    });
    private clientPlatform = {
        platformType: "PC",
        platformOS: "Windows",
        platformOSVersion: "10.0.19043.1.256.64bit",
        platformChipset: "Unknown"
    };

    private parseUrl = (uri: string) => {
        const loginResponseURI = new URL(uri);
        const accessToken = loginResponseURI.searchParams.get('access_token');
        const idToken = loginResponseURI.searchParams.get('id_token')
        const expiresIn = Number(loginResponseURI.searchParams.get('expires_in'));
    
        return { accessToken, idToken, expiresIn };
    }

    private makeHeaders = () => {
        this.headers = {
            Authorization: `Bearer ${this.tokens.accessToken}`,
            'X-Riot-Entitlements-JWT': this.tokens.entitlementsToken,
            'X-Riot-ClientVersion': this.clientVersion,
            'X-Riot-ClientPlatform': Buffer.from(
                JSON.stringify(this.clientPlatform)).toString('base64'),
        }
    }

    private createSession = (ssidCookie?: string) => axios({
        url: 'https://auth.riotgames.com/api/v1/authorization',
        method: 'POST',
        headers: {
            ...typeof ssidCookie === 'undefined' ? '' : { Cookie: ssidCookie },
            'User-Agent': 'RiotClient/60.0.10.4802528.4749685 rso-auth (Windows;10;;Professional, x64)'
        },
        data: {
            client_id: "play-valorant-web-prod",
            nonce: 1,
            redirect_uri: "https://playvalorant.com/opt_in",
            response_type: "token id_token",
            // response params are returned as a query instead of hash
            // URL class can properly parse params this way
            response_mode: "query",
            // this gives us a bigger response on /userinfo + required
            // for auto detecting region
            scope: "account openid"
        },
        httpsAgent: this.agent
    });

    private login = (cookie: string, username: string, password: string) => axios({
        url: 'https://auth.riotgames.com/api/v1/authorization',
        method: 'PUT',
        headers: {
            Cookie: cookie,
            'User-Agent': 'RiotClient/60.0.10.4802528.4749685 rso-auth (Windows; 10;;Professional, x64)'
        },
        data: {
            type: 'auth',
            username,
            password
        },
        httpsAgent: this.agent
    });

    private send2faCode = (cookie: string, code: string, rememberDevice = true) => axios({
        url: 'https://auth.riotgames.com/api/v1/authorization',
        method: 'PUT',
        headers: {
            Cookie: cookie,
            'User-Agent': 'RiotClient/60.0.10.4802528.4749685 rso-auth (Windows; 10;;Professional, x64)'
        },
        data: {
            type: 'multifactor',
            code,
            rememberDevice
        },
        httpsAgent: this.agent
    });

    private fetchEntitlements = (accessToken: string) => axios({
        url: 'https://entitlements.auth.riotgames.com/api/token/v1',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        data: {}
    });

    private fetchPas = (accessToken: string, idToken: string) =>  axios({
        url: 'https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant',
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        data: {
            id_token: idToken
        }
    });

    private fetchValorantVersion = () =>  axios({
        url: 'https://valorant-api.com/v1/version',
        method: 'GET'
    });

    private setupReauth = async () => {
        // access token -> every 1h | id token -> every 24h
        setInterval(async () => {
            try {
                const response = await this.createSession(this.ssidCookie);
    
                this.ssidCookie = response.headers['set-cookie'].find((elem: string) => /^ssid/.test(elem));
    
                this.tokens = { ...this.tokens, ...this.parseUrl(response.data.response.parameters.uri) };
                this.makeHeaders();
            } catch (err) {
                console.trace(err)
            }
            // reauth 5 min early as then there is no downtime
        }, (this.tokens.expiresIn - 300) * 1000);
    }

    public setCredentials = (riotID: string, password: string) => {
        this.username = riotID;
        this.password = password;
    }

    public getAccessToken = () => {
        return this.tokens.accessToken;
    }

    public getClientVersion = () => {
        return this.clientVersion;
    }

    public getClientPlatform = () => {
        return this.clientPlatform;
    }

    public getRegion = () => {
        return this.region;
    }

    public step1 = async (): Promise<ValoAuthRes> => {
        this.session = await this.createSession();
        this.asidCookie = this.session.headers['set-cookie'].find((cookie: string) => /^asid/.test(cookie));

        let result: ValoAuthRes = { success: false };
        const loginResponse = await this.login(this.asidCookie, this.username, this.password)
            .catch((err: any) => {
                if (typeof err.response.data === 'undefined') {
                    result = {
                        success: false,
                        error: 'unknown',
                        detail: err.response
                    };
                    //console.log(result);
                    return result;
                }
                if (err.response.data.error === 'rate_limited') {
                    result = {
                        success: false,
                        error: 'rate limited'
                    };
                    //console.log(result);
                    return result;
                }
                result = {
                    success: false,
                    error: 'unknown',
                    detail: err.response.data
                };
                //console.log(result);
                return result;
            });
        if(typeof loginResponse.data.error !== 'undefined') {
            console.dir(loginResponse.data)
            if (loginResponse.data.error === 'auth_failure') {
                result = {
                    success: false,
                    error: 'invalid credentials'
                };
                //console.log(result);
                return result;
            }
            result = {
                success: false,
                error: 'detail',
                detail: loginResponse.data
            };
            //console.log(result);
            return result;
        }

        this.asidCookie = loginResponse.headers['set-cookie'].find((cookie: string) => /^asid/.test(cookie));
        let response;

        if (loginResponse.data.type === 'response') {
            response = loginResponse;
            this.ssidCookie = response.headers['set-cookie'].find((cookie: string) => /^ssid/.test(cookie));
            this.tokens = this.parseUrl(response.data.response.parameters.uri);
            this.tokens.entitlementsToken = (await this.fetchEntitlements(this.tokens.accessToken)).data.entitlements_token;
            const puuid = JSON.parse(Buffer.from(this.tokens.accessToken.split('.')[1], 'base64').toString()).sub;
            
            // fetch pas token - not required, instead we only want the region
            // since we already fetched it let's save it, because why not
            const pasTokenResponse = await this.fetchPas(this.tokens.accessToken, this.tokens.idToken);
            this.tokens.pasToken = pasTokenResponse.data.token;
    
            this.region = pasTokenResponse.data.affinities.live;
    
            this.clientVersion = (await this.fetchValorantVersion()).data.data.riotClientVersion;
            
            this.makeHeaders();

            result = {
                success: true,
                twofa: false,
                debuginfo: response,
                ssid: this.ssidCookie,
            };
            //console.log(result);
            return result;
        } else if (loginResponse.data.type === 'multifactor') {
            result = {
                success: true,
                twofa: true,
                debuginfo: loginResponse.data
            };
            //console.log(result);
            return result;
        }

        result = {
            success: false,
            error: 'unknown'
        }
        console.log(result);
        return result;
    }

    public step2 = async (code: string): Promise<ValoAuthRes> => {
        const response2fa = await this.send2faCode(this.asidCookie, code)
            .catch((err: any) => {
                if (typeof err.response.data === 'undefined')
                    return {
                        success: false,
                        error: 'unknown',
                        detail: err.response
                    };
                if (err.response.data.error === 'rate_limited')
                    return {
                        success: false,
                        error: 'rate limited'
                    };
                return {
                    success: false,
                    error: 'unknown',
                    detail: err.response.data
                };
            });
        this.asidCookie = response2fa.headers['set-cookie'].find((cookie: string) => /^asid/.test(cookie));
        let response;
        if (response2fa.data.type === 'response') {
            response = response2fa;
        }
        // check response
        if(typeof response2fa.data.error !== 'undefined') {
            if (response2fa.data.error === 'multifactor_attempt_failed')
                return {
                    success: false,
                    error: 'invalid code'
                };
            if (response2fa.data.error === 'rate_limited')
                return {
                    success: false,
                    error: 'rate limited'
                };
            return {
                success: false,
                error: 'unknown',
                detail: response2fa.data
            };
        }
        this.ssidCookie = response.headers['set-cookie'].find((cookie: string) => /^ssid/.test(cookie));
        this.tokens = this.parseUrl(response.data.response.parameters.uri);
        this.tokens.entitlementsToken = (await this.fetchEntitlements(this.tokens.accessToken)).data.entitlements_token;
        const puuid = JSON.parse(Buffer.from(this.tokens.accessToken.split('.')[1], 'base64').toString()).sub;
        
        const pasTokenResponse = await this.fetchPas(this.tokens.accessToken, this.tokens.idToken);
        this.tokens.pasToken = pasTokenResponse.data.token;

        this.region = pasTokenResponse.data.affinities.live;

        this.clientVersion = (await this.fetchValorantVersion()).data.data.riotClientVersion;
        
        this.makeHeaders();

        return {
            success: true,
            ssid: this.ssidCookie
        };
    }

    public reauth = async (ssidCookie: string): Promise<ValoAuthRes> => {
        //console.log('in valoauth', ssidCookie);
        return this.createSession(ssidCookie).then(async (response: any) => {
            try {
                this.ssidCookie = response.headers['set-cookie'].find((elem: string) => /^ssid/.test(elem));
                this.tokens = { ...this.tokens, ...this.parseUrl(response.data.response.parameters.uri) };
                const pasTokenResponse = await this.fetchPas(this.tokens.accessToken, this.tokens.idToken);
                this.tokens.pasToken = pasTokenResponse.data.token;
        
                this.region = pasTokenResponse.data.affinities.live;
        
                this.clientVersion = (await this.fetchValorantVersion()).data.data.riotClientVersion;
                
                this.makeHeaders();
                this.makeHeaders();
                return {
                    success: true,
                    ssid: this.ssidCookie
                };
            } catch (e) {
                console.log('error in reauth', e);
                return {
                    success: false
                }
            }
        });
        /*
        const response = await this.createSession(ssidCookie);
        this.ssidCookie = response.headers['set-cookie'].find((elem: string) => /^ssid/.test(elem));
        this.tokens = { ...this.tokens, ...this.parseUrl(response.data.response.parameters.uri) };
        this.makeHeaders();
        return {
            success: true,
            ssid: this.ssidCookie
        };
        */
    }
}