export type WtpConfig = {
    auth0Domain: string;
    serverUrl: string;
};

declare var WTP_CONFIG: WtpConfig;

console.log('config', WTP_CONFIG);

export const config = WTP_CONFIG;
