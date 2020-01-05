export type YIRConfig = {
    serverUrl: string;
};

declare var YIR_CONFIG: YIRConfig;

export const config = YIR_CONFIG;
