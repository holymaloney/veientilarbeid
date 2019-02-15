const w = (window as any); // tslint:disable-line:no-any

const logEvent = w.frontendlogger ? w.frontendlogger.event : () => { return; };

const domene = 'veientilarbeid';

export const klikkPaSokLedigeStillinger = (sokeKnappType: string) => {
    logEvent(`${domene}.sokledigestillinger`, {}, {sokeKnappType});
};

export const logInputSokLedigeStillinger = (inputSokefelt: string) => {
    logEvent(`${domene}.inputsokledigestillinger`, {inputSokefelt}, {});
};

export const gaTilAktivitetsplan = (underOppfolging: boolean) => {
    logEvent(`${domene}.gatilaktivitetsplan`, {}, {underOppfolging});
};
