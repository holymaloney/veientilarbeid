import * as Brukerregistrering from '../ducks/brukerregistrering';
import * as Oppfolging from '../ducks/oppfolging';
import * as BrukerInfo from '../ducks/bruker-info';
import { AmplitudeData } from '../metrics/amplitude-utils';
import sjekkOmBrukerErStandardInnsatsgruppe from './er-standard-innsatsgruppe';

export function erKSSBruker({
    brukerInfoData,
    oppfolgingData,
    registreringData,
    amplitudeData,
}: {
    brukerInfoData: BrukerInfo.Data;
    oppfolgingData: Oppfolging.Data;
    registreringData: Brukerregistrering.Data | null;
    amplitudeData: AmplitudeData;
}): boolean {
    const skalSeEksperiment = amplitudeData.eksperimenter.includes('onboarding14a');
    const erAAP = brukerInfoData.rettighetsgruppe === 'AAP';
    const brukerregistreringData = registreringData?.registrering ?? null;

    const aldersgruppeUtenForsterketInnsats = brukerInfoData.alder >= 30 && brukerInfoData.alder <= 55;

    return (
        aldersgruppeUtenForsterketInnsats &&
        !erAAP &&
        skalSeEksperiment &&
        sjekkOmBrukerErStandardInnsatsgruppe({ brukerregistreringData, oppfolgingData }) &&
        !oppfolgingData.kanReaktiveres
    );
}
