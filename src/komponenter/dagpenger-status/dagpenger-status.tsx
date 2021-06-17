import React from 'react';
import './dagpenger-status.less';
import { FeaturetoggleContext } from '../../ducks/feature-toggles';
import * as Brukerregistrering from '../../ducks/brukerregistrering';
import * as Oppfolging from '../../ducks/oppfolging';
import * as BrukerInfo from '../../ducks/bruker-info';
import * as PaabegynteSoknader from '../../ducks/paabegynte-soknader';
import * as Sakstema from '../../ducks/sakstema';
import { kanVise14AStatus } from '../14a-intro/14a';
import { AmplitudeContext } from '../../ducks/amplitude-context';
import { loggAktivitet } from '../../metrics/metrics';
import beregnDagpengerSokeStatus, { DagpengerSokestatuser, sistOppdaterteBehandling } from './beregn-dagpenger-status';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import { lenker } from '../dittnav/utils/lenker';
import { Behandling } from '../../utils/dager-fra-innsendt-soknad';
import prettyPrintDato from '../../utils/pretty-print-dato';
import InViewport from '../in-viewport/in-viewport';
import ErRendret from '../er-rendret/er-rendret';

const virkedager = require('@alheimsins/virkedager');

function DagpengerStatus() {
    const amplitudeData = React.useContext(AmplitudeContext);
    const { data: featuretoggleData } = React.useContext(FeaturetoggleContext);
    const { data: registreringData } = React.useContext(Brukerregistrering.BrukerregistreringContext);
    const { data: oppfolgingData } = React.useContext(Oppfolging.OppfolgingContext);
    const { data: brukerInfoData } = React.useContext(BrukerInfo.BrukerInfoContext);
    const { data: paabegynteSoknaderData } = React.useContext(PaabegynteSoknader.PaabegynteSoknaderContext);
    const { data: sakstemaData } = React.useContext(Sakstema.SakstemaContext);

    const featuretoggleAktivert = featuretoggleData['veientilarbeid.dagpenger-status'];

    function loggLenkeKlikk(aktivitet: string, url: string) {
        loggAktivitet({ aktivitet, ...amplitudeData });
        window.location.assign(url);
    }

    const kanViseKomponent =
        featuretoggleAktivert && kanVise14AStatus({ amplitudeData, oppfolgingData, brukerInfoData, registreringData });

    if (!kanViseKomponent) return null;

    const opprettetRegistreringDatoString = registreringData?.registrering?.opprettetDato;
    const opprettetRegistreringDato = opprettetRegistreringDatoString
        ? new Date(opprettetRegistreringDatoString)
        : null;
    const dagpengerSaksTema = sakstemaData.sakstema.find((tema) => tema.temakode === 'DAG');
    const behandlingskjeder = dagpengerSaksTema ? dagpengerSaksTema.behandlingskjeder : null;

    const paabegynteSoknader = paabegynteSoknaderData.soknader;
    const rettighetsgruppe = brukerInfoData.rettighetsgruppe;

    const dagpengerSokeStatus = beregnDagpengerSokeStatus({
        opprettetRegistreringDato,
        rettighetsgruppe,
        paabegynteSoknader,
        behandlingskjeder,
    });

    let sisteBehandling = null;
    if (opprettetRegistreringDato && behandlingskjeder)
        sisteBehandling = sistOppdaterteBehandling(behandlingskjeder, opprettetRegistreringDato);

    let sistePaabegynte = null;
    if (paabegynteSoknader.length > 0) {
        paabegynteSoknader.sort((a, b) => {
            return new Date(b.dato).getTime() - new Date(a.dato).getTime();
        });
        sistePaabegynte = paabegynteSoknader[0];
    }

    switch (dagpengerSokeStatus) {
        case DagpengerSokestatuser.mottarDagpenger:
            return <MottarDagpenger behandling={sisteBehandling} loggLenkeKlikk={loggLenkeKlikk} />;
        case DagpengerSokestatuser.soknadFerdigBehandlet:
            return <FerdigBehandletSoknad loggLenkeKlikk={loggLenkeKlikk} />;
        case DagpengerSokestatuser.soknadUnderBehandling:
            return <SoknadTilBehandling behandlingskjeder={behandlingskjeder} loggLenkeKlikk={loggLenkeKlikk} />;
        case DagpengerSokestatuser.harPaabegynteSoknader:
            return <PaabegyntSoknad paabegynt={sistePaabegynte} loggLenkeKlikk={loggLenkeKlikk} />;
        case DagpengerSokestatuser.ukjentStatus:
            return <IkkeSoktDagpenger loggLenkeKlikk={loggLenkeKlikk} />;
        default:
            return null;
    }
}

function IkkeSoktDagpenger({ loggLenkeKlikk }: { loggLenkeKlikk: Function }) {
    return (
        <DagpengerDekorator tittle={'Du har ikke søkt om dagpenger'}>
            <div>
                <Normaltekst className={'blokk-xs'}>
                    Du kan tidligst få dagpenger fra den dagen du sender inn søknaden.
                </Normaltekst>
                <Normaltekst className={'blokk-xs'}>
                    Har du spørsmål om dagpenger må du bruke{' '}
                    <Lenke
                        href="https://mininnboks.nav.no/sporsmal/skriv/ARBD"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til STO fra ikke søkt om dagpenger',
                                'https://mininnboks.nav.no/sporsmal/skriv/ARBD'
                            )
                        }
                    >
                        Skriv til oss
                    </Lenke>{' '}
                    eller{' '}
                    <Lenke
                        href="https://www.nav.no/person/kontakt-oss/chat/"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til Chat fra ikke søkt om dagpenger',
                                'https://www.nav.no/person/kontakt-oss/chat/'
                            )
                        }
                    >
                        Chat
                    </Lenke>
                </Normaltekst>
            </div>
            <div>
                <LenkepanelBase
                    href={'https://www.nav.no/soknader/nb/person/arbeid/dagpenger'}
                    border={true}
                    className={'meldekort-send-inn-kort'}
                    onClick={() =>
                        loggLenkeKlikk(
                            'Går til Søk om dagpenger fra ikke søkt om dagpenger',
                            'https://www.nav.no/soknader/nb/person/arbeid/dagpenger'
                        )
                    }
                >
                    <div className="lenkepanel__innhold">
                        <div className="ml-1">
                            <Element>Søk om dagpenger</Element>
                            <Normaltekst>Du kan begynne nå og fortsette senere</Normaltekst>
                        </div>
                    </div>
                </LenkepanelBase>
            </div>
        </DagpengerDekorator>
    );
}

function MottarDagpenger({ behandling, loggLenkeKlikk }: { behandling: Behandling | null; loggLenkeKlikk: Function }) {
    return (
        <DagpengerDekorator tittle={'Du har fått innvilget dagpenger'}>
            <div>
                {behandling ? (
                    <Normaltekst className={'blokk-xs'}>
                        Du fikk svar på søknaden {prettyPrintDato(new Date(behandling.sistOppdatert).toISOString())}
                    </Normaltekst>
                ) : null}
            </div>

            <div>
                <Normaltekst className={'blokk-xs'}>
                    Du finner svarbrevet i{' '}
                    <Lenke
                        className={'tracking-wide'}
                        href={lenker.saksoversikt.url}
                        onClick={() =>
                            loggLenkeKlikk('Går til saksoversikten fra mottar dagpenger', lenker.saksoversikt.url)
                        }
                    >
                        Din saksoversikt
                    </Lenke>
                </Normaltekst>
                <Normaltekst>
                    Har du spørsmål om dagpenger må du bruke{' '}
                    <Lenke
                        href="https://mininnboks.nav.no/sporsmal/skriv/ARBD"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til STO fra mottar dagpenger',
                                'https://mininnboks.nav.no/sporsmal/skriv/ARBD'
                            )
                        }
                    >
                        Skriv til oss
                    </Lenke>{' '}
                    eller{' '}
                    <Lenke
                        href="https://www.nav.no/person/kontakt-oss/chat/"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til Chat fra mottar dagpenger',
                                'https://www.nav.no/person/kontakt-oss/chat/'
                            )
                        }
                    >
                        Chat
                    </Lenke>
                </Normaltekst>
            </div>
        </DagpengerDekorator>
    );
}

function FerdigBehandletSoknad({ loggLenkeKlikk }: { loggLenkeKlikk: Function }) {
    return (
        <DagpengerDekorator tittle={'Søknaden din om dagpenger er ferdig behandlet'}>
            <div>
                <Normaltekst className={'blokk-xs'}>
                    Du finner svarbrevet i{' '}
                    <Lenke
                        className={'tracking-wide'}
                        href={lenker.saksoversikt.url}
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til saksoversikten fra søknad ferdig behandlet',
                                lenker.saksoversikt.url
                            )
                        }
                    >
                        Din saksoversikt
                    </Lenke>
                </Normaltekst>
                <Normaltekst className={'blokk-xs'}>
                    Har du spørsmål om dagpenger må du bruke{' '}
                    <Lenke
                        href="https://mininnboks.nav.no/sporsmal/skriv/ARBD"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til STO fra søknad ferdig behandlet',
                                'https://mininnboks.nav.no/sporsmal/skriv/ARBD'
                            )
                        }
                    >
                        Skriv til oss
                    </Lenke>{' '}
                    eller{' '}
                    <Lenke
                        href="https://www.nav.no/person/kontakt-oss/chat/"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til Chat fra søknad ferdig behandlet',
                                'https://www.nav.no/person/kontakt-oss/chat/'
                            )
                        }
                    >
                        Chat
                    </Lenke>
                </Normaltekst>
            </div>
        </DagpengerDekorator>
    );
}

function PaabegyntSoknad({
    paabegynt,
    loggLenkeKlikk,
}: {
    paabegynt: PaabegynteSoknader.Soknad | null;
    loggLenkeKlikk: Function;
}) {
    if (!paabegynt) return null;

    return (
        <DagpengerDekorator tittle={'Du har startet på en søknad om dagpenger, men ikke sendt den inn'}>
            <div>
                <Normaltekst className={'blokk-xs gul-uthevingslinje'}>
                    <b>Du kan tidligst få dagpenger</b> fra den dagen du sender inn søknaden.
                </Normaltekst>
            </div>

            <div>
                <LenkepanelBase
                    href={paabegynt.lenke}
                    border={true}
                    className={'meldekort-send-inn-kort'}
                    onClick={() =>
                        loggLenkeKlikk('Går til Fortsett på søknaden fra påbegynte søknader', paabegynt.lenke)
                    }
                >
                    <div className="lenkepanel__innhold">
                        <div className="ml-1">
                            <Element>Fortsett på søknaden</Element>
                            <Normaltekst>
                                Du startet på søknaden den {prettyPrintDato(new Date(paabegynt.dato).toISOString())}
                            </Normaltekst>
                        </div>
                    </div>
                </LenkepanelBase>

                <Normaltekst className={'blokk-xs'}>
                    Har du spørsmål om dagpenger må du bruke{' '}
                    <Lenke
                        href="https://mininnboks.nav.no/sporsmal/skriv/ARBD"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til STO fra påbegynte søknader',
                                'https://mininnboks.nav.no/sporsmal/skriv/ARBD'
                            )
                        }
                    >
                        Skriv til oss
                    </Lenke>{' '}
                    eller{' '}
                    <Lenke
                        href="https://www.nav.no/person/kontakt-oss/chat/"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til Chat fra påbegynte søknader',
                                'https://www.nav.no/person/kontakt-oss/chat/'
                            )
                        }
                    >
                        Chat
                    </Lenke>
                </Normaltekst>
            </div>
        </DagpengerDekorator>
    );
}

function SoknadTilBehandling({
    behandlingskjeder,
    loggLenkeKlikk,
}: {
    behandlingskjeder: Behandling[] | null;
    loggLenkeKlikk: Function;
}) {
    const datoForSisteInnsendeSoknad = (behandlingskjeder: Behandling[] | null): Date => {
        if (!behandlingskjeder) return new Date();

        const dato = behandlingskjeder
            .filter((behandling) => behandling.status === 'UNDER_BEHANDLING')
            .sort((a, b) => {
                return new Date(b.sistOppdatert).getTime() - new Date(a.sistOppdatert).getTime();
            })[0].sistOppdatert;

        return new Date(dato);
    };

    const datoForSisteInnsendteSoknad = datoForSisteInnsendeSoknad(behandlingskjeder);
    const kopiAvDatoForSisteInnsendteSoknad = new Date(datoForSisteInnsendteSoknad.toISOString());
    const datoForForventetSvar = new Date(virkedager(kopiAvDatoForSisteInnsendteSoknad, 30));
    const dagensDato = new Date();

    const ForventetSvar = () => {
        return (
            <Normaltekst className={'blokk-xs'}>
                Du kan <b>forvente svar</b> innen {prettyPrintDato(datoForForventetSvar?.toISOString())}
            </Normaltekst>
        );
    };

    const Saksbehandlingstider = ({ loggLenkeKlikk }: { loggLenkeKlikk: Function }) => {
        return (
            <Normaltekst className={'blokk-xs'}>
                Normal saksbehandlingstid er 30 dager. Se{' '}
                <Lenke
                    href="https://www.nav.no/no/nav-og-samfunn/om-nav/saksbehandlingstider-i-nav"
                    onClick={() =>
                        loggLenkeKlikk(
                            'Går til saksbehandlingstid fra innsendt søknad',
                            'https://www.nav.no/no/nav-og-samfunn/om-nav/saksbehandlingstider-i-nav'
                        )
                    }
                >
                    saksbehandlingsoversikten
                </Lenke>{' '}
                for mer informasjon.
            </Normaltekst>
        );
    };

    return (
        <DagpengerDekorator tittle={'Vi har mottatt søknad om dagpenger'}>
            <div>
                <Normaltekst className={'blokk-xs'}>
                    Siste søknad mottatt: {prettyPrintDato(datoForSisteInnsendteSoknad?.toISOString())}{' '}
                </Normaltekst>
                {dagensDato < datoForForventetSvar ? (
                    <ForventetSvar />
                ) : (
                    <Saksbehandlingstider loggLenkeKlikk={loggLenkeKlikk} />
                )}
            </div>

            <div>
                <Normaltekst className={'blokk-xs'}>
                    Du finner din innsendte søknad i{' '}
                    <Lenke
                        className={'tracking-wide'}
                        href={lenker.saksoversikt.url}
                        onClick={() =>
                            loggLenkeKlikk('Går til saksoversikten fra innsendt søknad', lenker.saksoversikt.url)
                        }
                    >
                        Din saksoversikt
                    </Lenke>
                </Normaltekst>
                <Normaltekst className={'blokk-xs'}>
                    Har du spørsmål om dagpenger må du bruke{' '}
                    <Lenke
                        href="https://mininnboks.nav.no/sporsmal/skriv/ARBD"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til STO fra innsendt søknad',
                                'https://mininnboks.nav.no/sporsmal/skriv/ARBD'
                            )
                        }
                    >
                        Skriv til oss
                    </Lenke>{' '}
                    eller{' '}
                    <Lenke
                        href="https://www.nav.no/person/kontakt-oss/chat/"
                        onClick={() =>
                            loggLenkeKlikk(
                                'Går til Chat fra innsendt søknad',
                                'https://www.nav.no/person/kontakt-oss/chat/'
                            )
                        }
                    >
                        Chat
                    </Lenke>
                </Normaltekst>
            </div>
        </DagpengerDekorator>
    );
}

interface DapengerDekoratorProps {
    tittle: string;
    children: React.ReactNode;
}

function DagpengerDekorator(props: DapengerDekoratorProps) {
    return (
        <div className={'dagpenger-status-omslutning'}>
            <ErRendret loggTekst="Rendrer dagpengerstatus" />
            <div>
                <Element tag={'h1'}>DAGPENGER</Element>
                <Systemtittel className={'blokk-xs'}>{props.tittle}</Systemtittel>
            </div>
            {props?.children}
            <InViewport loggTekst="Viser dagpengerstatus i viewPort" />
        </div>
    );
}

export default DagpengerStatus;
