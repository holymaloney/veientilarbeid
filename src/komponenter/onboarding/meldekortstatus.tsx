/**
 * Viser faresignal siste uken - viktigst
 *
 * dato for neste, dato for frist
 *
 * link til meldekort
 */

import React from 'react';
import MeldekortAdvarsel from './meldekort-advarsel';
import * as Meldekort from '../../ducks/meldekort';
import { beregnDagerEtterFastsattMeldedag, beregnDagerTilInaktivering } from '../../utils/meldekort-utils';
import './meldekortstatus.less';
import { AmplitudeContext } from '../../ducks/amplitude-context';
import { OppfolgingContext } from '../../ducks/oppfolging';
import { Normaltekst } from 'nav-frontend-typografi';
import { hentIDag } from '../../utils/chrono';
import { datoUtenTid, plussDager, datoMedUkedag } from '../../utils/date-utils';

function Meldekortstatus() {
    const { data: meldekortData } = React.useContext(Meldekort.MeldekortContext);
    const { kanReaktiveres } = React.useContext(OppfolgingContext).data;

    const amplitudeData = React.useContext(AmplitudeContext);
    if (!meldekortData || kanReaktiveres) return null;

    const iDag = datoUtenTid(hentIDag().toISOString());
    const dagerEtterFastsattMeldedag = beregnDagerEtterFastsattMeldedag(iDag, meldekortData);

    if (dagerEtterFastsattMeldedag === null) return null;

    // Bare vis melding fra dag 1 (tirsdag) til dag 7 (mandag)
    const mellomDag1Til7 = dagerEtterFastsattMeldedag > 0 && dagerEtterFastsattMeldedag <= 7;

    const dagerTilInaktivering = beregnDagerTilInaktivering(dagerEtterFastsattMeldedag);
    const inaktiveringsDato = plussDager(iDag, dagerTilInaktivering);

    return (
        <div className={'onboarding-meldekortvarsel-container'}>
            {mellomDag1Til7 ? (
                <MeldekortAdvarsel
                    dagerEtterFastsattMeldedag={dagerEtterFastsattMeldedag}
                    amplitudeData={amplitudeData}
                />
            ) : (
                <>
                    <Normaltekst>Du kan nå sende inn meldekort.</Normaltekst>
                    <Normaltekst>{`Fristen er ${datoMedUkedag(inaktiveringsDato)}, klokken 23.00.`}</Normaltekst>
                </>
            )}
        </div>
    );
}

export default Meldekortstatus;
