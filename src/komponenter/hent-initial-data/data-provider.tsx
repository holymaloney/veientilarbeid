import * as React from 'react';
import Innholdslaster from '../innholdslaster/innholdslaster';
import Feilmelding from '../feilmeldinger/feilmelding';
import * as BrukerInfo from '../../ducks/bruker-info';
import * as Brukerregistrering from '../../ducks/brukerregistrering';
import * as Motestotte from '../../ducks/motestotte';
import * as Egenvurdering from '../../ducks/egenvurdering';
import * as UlesteDialoger from '../../ducks/ulestedialoger';
import * as Jobbsokerbesvarelse from '../../ducks/jobbsokerbesvarelse';
import { fetchData } from '../../ducks/api-utils';
import {
    MOTESTOTTE_URL,
    BRUKERINFO_URL,
    EGENVURDERINGBESVARELSE_URL,
    ULESTEDIALOGER_URL,
    JOBBSOKERBESVARELSE_URL,
} from '../../ducks/api';
import { AmplitudeProvider } from './amplitude-provider';
import { ForeslattInnsatsgruppe, selectForeslattInnsatsgruppe } from '../../ducks/brukerregistrering';

const skalSjekkeEgenvurderingBesvarelse = (
    foreslaattInnsatsgruppe: ForeslattInnsatsgruppe | undefined | null
): boolean => {
    return (
        foreslaattInnsatsgruppe === ForeslattInnsatsgruppe.STANDARD_INNSATS ||
        foreslaattInnsatsgruppe === ForeslattInnsatsgruppe.SITUASJONSBESTEMT_INNSATS
    );
};

interface OwnProps {
    children: React.ReactNode;
}

type Props = OwnProps;

const DataProvider = ({ children }: Props) => {
    const [motestotteState, setMotestotteState] = React.useState<Motestotte.State>(Motestotte.initialState);
    const [brukerInfoState, setBrukerInfoState] = React.useState<BrukerInfo.State>(BrukerInfo.initialState);
    const [egenvurderingState, setEgenvurderingState] = React.useState<Egenvurdering.State>(Egenvurdering.initialState);
    const [ulesteDialogerState, setUlesteDialogerState] = React.useState<UlesteDialoger.State>(
        UlesteDialoger.initialState
    );
    const [jobbsokerbesvarelseState, setJobbsokerbesvarelseState] = React.useState<Jobbsokerbesvarelse.State>(
        Jobbsokerbesvarelse.initialState
    );

    const data = React.useContext(Brukerregistrering.BrukerregistreringContext).data;
    const foreslaattInnsatsgruppe = selectForeslattInnsatsgruppe(data);

    React.useEffect(() => {
        fetchData<BrukerInfo.State, BrukerInfo.Data>(brukerInfoState, setBrukerInfoState, BRUKERINFO_URL);
        fetchData<UlesteDialoger.State, UlesteDialoger.Data>(
            ulesteDialogerState,
            setUlesteDialogerState,
            ULESTEDIALOGER_URL
        );
        fetchData<Jobbsokerbesvarelse.State, Jobbsokerbesvarelse.Data>(
            jobbsokerbesvarelseState,
            setJobbsokerbesvarelseState,
            JOBBSOKERBESVARELSE_URL
        );
        if (skalSjekkeEgenvurderingBesvarelse(foreslaattInnsatsgruppe)) {
            fetchData<Egenvurdering.State, Egenvurdering.Data>(
                egenvurderingState,
                setEgenvurderingState,
                EGENVURDERINGBESVARELSE_URL
            );
        } else if (foreslaattInnsatsgruppe === ForeslattInnsatsgruppe.BEHOV_FOR_ARBEIDSEVNEVURDERING) {
            fetchData<Motestotte.State, Motestotte.Data>(motestotteState, setMotestotteState, MOTESTOTTE_URL);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const avhengigheter: any[] = [brukerInfoState];
    const ventPa: any[] = [ulesteDialogerState, jobbsokerbesvarelseState];
    if (skalSjekkeEgenvurderingBesvarelse(foreslaattInnsatsgruppe)) {
        ventPa.push(egenvurderingState);
    }
    if (foreslaattInnsatsgruppe === ForeslattInnsatsgruppe.BEHOV_FOR_ARBEIDSEVNEVURDERING) {
        ventPa.push(motestotteState);
    }

    return (
        <Innholdslaster
            feilmeldingKomponent={<Feilmelding tekstId="feil-i-systemene-beskrivelse" />}
            storrelse="XXL"
            avhengigheter={avhengigheter}
            ventPa={ventPa}
        >
            <BrukerInfo.BrukerInfoContext.Provider value={brukerInfoState}>
                <UlesteDialoger.UlesteDialogerContext.Provider value={ulesteDialogerState}>
                    <Jobbsokerbesvarelse.JobbsokerbesvarelseContext.Provider value={jobbsokerbesvarelseState}>
                        <Egenvurdering.EgenvurderingContext.Provider value={egenvurderingState}>
                            <Motestotte.MotestotteContext.Provider value={motestotteState}>
                                <AmplitudeProvider>{children}</AmplitudeProvider>
                            </Motestotte.MotestotteContext.Provider>
                        </Egenvurdering.EgenvurderingContext.Provider>
                    </Jobbsokerbesvarelse.JobbsokerbesvarelseContext.Provider>
                </UlesteDialoger.UlesteDialogerContext.Provider>
            </BrukerInfo.BrukerInfoContext.Provider>
        </Innholdslaster>
    );
};

export default DataProvider;
