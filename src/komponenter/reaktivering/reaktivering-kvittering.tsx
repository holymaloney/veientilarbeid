import { Panel, Heading, BodyShort, Link, Button } from '@navikt/ds-react';
import { Close } from '@navikt/ds-icons';
import { useEffect, useState } from 'react';

import { useAmplitudeData } from '../../contexts/amplitude-context';
import { dagpengerSoknadLenke } from '../../innhold/lenker';
import { loggAktivitet } from '../../metrics/metrics';

import ErRendret from '../er-rendret/er-rendret';
import InViewport from '../in-viewport/in-viewport';
import useVisKvittering from '../../hooks/use-vis-kvittering';
import { fjernQueryParam } from '../../utils/query-param-utils';
import lagHentTekstForSprak from '../../lib/lag-hent-tekst-for-sprak';
import { useSprakValg } from '../../contexts/sprak';

const TEKSTER = {
    nb: {
        tittel: 'Dagpenger',
        ingress: 'Du må søke om dagpenger på nytt',
        lukk: 'Lukk kvittering',
        sok: 'Søk dagpenger',
        utbetalingStoppet:
            'Har du mottatt dagpenger vil utbetalingene være stoppet og du må derfor sende inn ny søknad.',
        tidligstMotta: 'Du kan tidligst få dagpenger igjen fra den dagen du sender søknaden.',
        skalIkke: 'Skal ikke søke dagpenger nå',
    },
    en: {
        tittel: 'Unemployment benefits',
        ingress: 'You will need to apply for unemployment benefits again',
        lukk: 'Close message',
        sok: 'Apply for unemployment benefit',
        utbetalingStoppet:
            'If you have received unemployment benefits, the payments will be stopped and you must therefore submit a new application.',
        tidligstMotta:
            'You will receive unemployment benefits at the earliest from the day you applied for unemployment benefit.',
        skalIkke: 'I will not apply for unemployment benefit at the moment',
    },
};

const ReaktiveringKvittering = () => {
    const amplitudeData = useAmplitudeData();
    const [visKomponent, setVisKonponent] = useState(false);
    const visKvittering = useVisKvittering('reaktivering');
    const tekst = lagHentTekstForSprak(TEKSTER, useSprakValg().sprak);

    useEffect(() => {
        setVisKonponent(visKvittering);
    }, [visKvittering]);

    function lukkerKvittering(loggTekst: string) {
        loggAktivitet({ aktivitet: loggTekst, ...amplitudeData });
        fjernQueryParam('visKvittering');
        setVisKonponent(false);
    }

    function sokDagpenger(loggTekst: string) {
        loggAktivitet({ aktivitet: loggTekst, ...amplitudeData });
        window.location.assign(dagpengerSoknadLenke);
        fjernQueryParam('visKvittering');
        setVisKonponent(false);
    }

    function handleLukkeKvitteringKnapp(event: React.SyntheticEvent) {
        event.preventDefault();
        event.stopPropagation();
        lukkerKvittering('Lukker kvittering etter reaktivering');
    }

    function handleIkkeSokeNaa(event: React.SyntheticEvent) {
        event.preventDefault();
        event.stopPropagation();
        lukkerKvittering('Skal ikke søke dagpenger nå etter reaktivering');
    }

    function handleSokGjenopptak(event: React.SyntheticEvent) {
        event.preventDefault();
        event.stopPropagation();
        sokDagpenger('Går til dagpengesøknad etter reaktivering');
    }

    if (!visKomponent) {
        return null;
    }

    return (
        <>
            <Panel className={'blokk-s'} border>
                <div className="flex space-between blokk-s">
                    <div>
                        <Heading size="xsmall" level="1">
                            {tekst('tittel')}
                        </Heading>
                        <Heading size="medium">{tekst('ingress')}</Heading>
                    </div>
                    <Button variant="tertiary" size="small" onClick={handleLukkeKvitteringKnapp}>
                        <Close color="black" title={tekst('lukk')} />
                    </Button>
                </div>
                <div>
                    <BodyShort className="blokk-xs">{tekst('utbetalingStoppet')}</BodyShort>
                    <BodyShort className="blokk-xs">{tekst('tidligstMotta')}</BodyShort>
                    <Button variant="secondary" onClick={handleSokGjenopptak} className="blokk-xs">
                        {tekst('sok')}
                    </Button>
                    <BodyShort>
                        <Link href="#" onClick={handleIkkeSokeNaa}>
                            {tekst('skalIkke')}
                        </Link>
                    </BodyShort>
                </div>
            </Panel>
            <ErRendret loggTekst="Rendrer kvittering etter reaktivering" />
            <InViewport loggTekst="Viser kvittering etter reaktivering i viewport" />
        </>
    );
};

export default ReaktiveringKvittering;
