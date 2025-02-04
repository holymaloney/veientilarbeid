import * as React from 'react';
import { Checkbox, CheckboxGroup, Heading, Select, Grid, Cell, Panel } from '@navikt/ds-react';

import {
    DemoData,
    hentAutentiseringsInfo,
    hentDagerEtterFastsattMeldedag,
    hentDagRelativTilFastsattMeldedag,
    hentDemoState,
    hentEgenvurdering,
    hentFormidlingsgruppe,
    hentGeografiskTilknytning,
    hentKanReaktiveres,
    hentMotestotte,
    hentRegistreringType,
    hentReservasjonKRR,
    hentRettighetsgruppe,
    hentServicegruppe,
    hentSykmeldtMedArbeidsgiver,
    hentUlesteDialoger,
    hentUnderOppfolging,
    hentDpStatus,
    hentKvitteringStatus,
    settAntallDagerEtterFastsattMeldedag,
    settAutentiseringsInfo,
    settEgenvurdering,
    settFeatureToggles,
    settFormidlingsgruppe,
    settGeografiskTilknytning,
    settKanReaktiveres,
    settMotestotte,
    settRegistreringType,
    settReservasjonKRR,
    settRettighetsgruppe,
    settServicegruppe,
    settSykmeldtMedArbeidsgiver,
    settUlesteDialoger,
    settUnderOppfolging,
    settDpStatus,
    settKvitteringStatus,
    hentAlder,
    settAlder,
    settDemoState,
} from './demo-state';

import { DinSituasjonSvar, ForeslattInnsatsgruppe, FremtidigSituasjonSvar } from '../contexts/brukerregistrering';
import {
    hentForeslattInnsatsgruppe,
    hentDinSituasjon,
    hentFremtidigSituasjon,
    hentOpprettetDato,
    settForeslattInnsatsgruppe,
    settDinSituasjon,
    settFremtidigSituasjon,
    settOpprettetDato,
} from './demo-state-brukerregistrering';
import { InnloggingsNiva } from '../contexts/autentisering';
import { setFastTidspunktForIDag } from '../utils/chrono';
import { datoUtenTid } from '../utils/date-utils';
import { FeatureToggles, prettyPrintFeatureToggle } from '../contexts/feature-toggles';

import './demo-dashboard.css';

interface OpprettetRegistreringDato {
    registrertForLanseringEgenvurdering: string;
    registrertMellomLanseringEgenvurderingOgMotestotte: string;
    registrertEtterLanseringMotestotte: string;
    registrertIDag: string;
    uke1: string;
    uke2: string;
    uke11: string;
    uke12: string;
}

export const opprettetRegistreringDato: OpprettetRegistreringDato = {
    registrertForLanseringEgenvurdering: '2019-05-09T12:00:00.111111+01:00',
    registrertMellomLanseringEgenvurderingOgMotestotte: '2019-05-11T12:00:00.111111+01:00',
    registrertEtterLanseringMotestotte: '2019-06-05T12:00:00.111111+01:00',
    registrertIDag: datoUtenTid(new Date().toISOString()).toISOString(),
    uke1: datoUtenTid(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()).toISOString(),
    uke2: datoUtenTid(new Date(new Date().setDate(new Date().getDate() - 7 * 2)).toISOString()).toISOString(),
    uke11: datoUtenTid(new Date(new Date().setDate(new Date().getDate() - 7 * 11)).toISOString()).toISOString(),
    uke12: datoUtenTid(new Date(new Date().setDate(new Date().getDate() - 7 * 12)).toISOString()).toISOString(),
};

const DemoDashboard = () => {
    const SYKMELDT_MED_ARBEIDSGIVER = DemoData.SYKMELDT_MED_ARBEIDSGIVER;
    const EGENVURDERING = DemoData.EGENVURDERING;
    const MOTESTOTTE = DemoData.MOTESTOTTE;
    const ULESTE_DIALOGER = DemoData.ULESTE_DIALOGER;
    const RESERVASJON_KRR = DemoData.RESERVASJON_KRR;
    const AUTENTISERINGS_INFO = DemoData.AUTENTISERINGS_INFO;
    const UNDER_OPPFOLGING = DemoData.UNDER_OPPFOLGING;
    const KAN_REAKTIVERES = DemoData.KAN_REAKTIVERES;
    const ER_UNDER_30 = DemoData.ER_UNDER_30;

    const FEATURE_TOGGLES: string[] = Object.values(FeatureToggles);

    const handleChangeServicegruppe = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settServicegruppe(e.target.value);
        window.location.reload();
    };

    const handleChangeFormidlingsgruppe = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settFormidlingsgruppe(e.target.value);
        window.location.reload();
    };

    const handleChangeDagpengeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settDpStatus(e.target.value);
        window.location.reload();
    };

    const handleChangeKvitteringStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settKvitteringStatus(e.target.value);
        window.location.reload();
    };

    const handleChangeRegistreringType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settRegistreringType(e.target.value);
        window.location.reload();
    };

    const handleChangeGeografiskTilknytning = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settGeografiskTilknytning(e.target.value);
        window.location.reload();
    };

    const handleChangeRettighetsgruppe = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settRettighetsgruppe(e.target.value);
        window.location.reload();
    };

    const handleChangeBrukerregistrering = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settFremtidigSituasjon(e.target.value as FremtidigSituasjonSvar);
        window.location.reload();
    };

    const handleChangeDinSituasjon = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settDinSituasjon(e.target.value as DinSituasjonSvar);
        window.location.reload();
    };

    const handleChangeForeslaattInnsatsgruppe = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settForeslattInnsatsgruppe(e.target.value as ForeslattInnsatsgruppe);
        window.location.reload();
    };

    const handleChangeOpprettetRegistreringDato = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settOpprettetDato(e.target.value);
        window.location.reload();
    };

    const handleChangeMeldekortdager = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settAntallDagerEtterFastsattMeldedag(e.target.value);
        window.location.reload();
    };

    const handleChangeSprak = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settDemoState(DemoData.SPRAK, e.target.value);
        window.location.reload();
    };

    const handleClick = (e: React.SyntheticEvent<EventTarget, Event>) => {
        const element = e.currentTarget as HTMLInputElement;
        if (element.id === SYKMELDT_MED_ARBEIDSGIVER) {
            settSykmeldtMedArbeidsgiver(element.checked);
        } else if (element.id === EGENVURDERING) {
            settEgenvurdering(element.checked);
        } else if (element.id === MOTESTOTTE) {
            settMotestotte(element.checked);
        } else if (FEATURE_TOGGLES.includes(element.id)) {
            settFeatureToggles(element.id, element.checked);
        } else if (element.id === ULESTE_DIALOGER) {
            settUlesteDialoger(element.checked);
        } else if (element.id === RESERVASJON_KRR) {
            settReservasjonKRR(element.checked);
        } else if (element.id === AUTENTISERINGS_INFO) {
            settAutentiseringsInfo(element.checked ? InnloggingsNiva.LEVEL_3 : InnloggingsNiva.LEVEL_4);
        } else if (element.id === UNDER_OPPFOLGING) {
            settUnderOppfolging(element.checked);
        } else if (element.id === KAN_REAKTIVERES) {
            settKanReaktiveres(element.checked);
        } else if (element.id === ER_UNDER_30) {
            settAlder(element.checked ? '25' : '42');
        }
        window.location.reload();
    };

    const servicegrupper = {
        IKVAL: 'Standard',
        BATT: 'Spesielt tilpasset',
        BFORM: 'Situasjonsbestemt',
        VARIG: 'Varig',
        IVURD: 'Ikke fastsatt',
        BKART: 'BKART',
    };

    const formidlingsgrupper = {
        ARBS: 'ARBS',
        IARBS: 'IARBS',
        ISERV: 'ISERV',
    };

    const dagpengeStatuser = {
        ukjent: 'Har ikke søkt dagpenger',
        paabegynt: 'Har startet dagpengesøknad',
        sokt: 'Har sendt søknad',
        soktogpaabegynt: 'Har sendt søknad og nytt utkast',
        innvilget: 'Søknad innvilget',
        avslag: 'Søknad avslått',
    };

    const kvitteringsStatuser = {
        kvitteringIkkeValgt: 'Ingen kvitteringer',
        reaktivering: 'Etter reaktivering',
        behovsvurderingJa: 'Etter ja behovsvurdering',
        behovsvurderingNei: 'Etter nei behovsvurdering',
    };

    const registreringTyper = {
        REAKTIVERING: 'REAKTIVERING',
        SPERRET: 'SPERRET',
        ALLEREDE_REGISTRERT: 'ALLEREDE_REGISTRERT',
        SYKMELDT_REGISTRERING: 'SYKMELDT_REGISTRERING',
        ORDINAER_REGISTRERING: 'ORDINAER_REGISTRERING',
    };

    const geografiskeTilknytninger = {
        '3808': 'Notodden',
        '010302': 'Grünerløkka',
        '110302': 'Tasta',
        '3422': 'Åmot',
    };

    const rettighetsgrupper = {
        AAP: 'AAP',
        DAGP: 'DAGP',
        INGEN_VERDI: 'INGEN_VERDI',
        IYT: 'IYT',
    };

    const fremtidigeSituasjoner = {
        SAMME_ARBEIDSGIVER: 'Samme arbeidsgiver',
        SAMME_ARBEIDSGIVER_NY_STILLING: 'Samme arbeidsgiver, ny stilling',
        NY_ARBEIDSGIVER: 'Ny arbeidsgiver',
        USIKKER: 'Usikker',
        INGEN_PASSER: 'Ingen passer',
    };

    const dineSituasjoner = {
        MISTET_JOBBEN: 'MISTET_JOBBEN',
        ALDRI_HATT_JOBB: 'ALDRI_HATT_JOBB',
        HAR_SAGT_OPP: 'HAR_SAGT_OPP',
        VIL_BYTTE_JOBB: 'VIL_BYTTE_JOBB',
        ER_PERMITTERT: 'ER_PERMITTERT',
        USIKKER_JOBBSITUASJON: 'USIKKER_JOBBSITUASJON',
        JOBB_OVER_2_AAR: 'JOBB_OVER_2_AAR',
        VIL_FORTSETTE_I_JOBB: 'VIL_FORTSETTE_I_JOBB',
        AKKURAT_FULLFORT_UTDANNING: 'AKKURAT_FULLFORT_UTDANNING',
        DELTIDSJOBB_VIL_MER: 'DELTIDSJOBB_VIL_MER',
        INGEN_SVAR: 'INGEN_SVAR',
        INGEN_VERDI: 'INGEN_VERDI',
    };

    const foreslattInnsatsgrupper = {
        STANDARD_INNSATS: 'Standard innsats',
        SITUASJONSBESTEMT_INNSATS: 'Situasjonsbestemt innsats',
        BEHOV_FOR_ARBEIDSEVNEVURDERING: 'Behov for arbeidsevnevurdering',
    };

    const opprettetRegistreringDatoLabels = {
        registrertForLanseringEgenvurdering: '09.05.19 - Før lansering egenvurdering/møtestøtte',
        registrertMellomLanseringEgenvurderingOgMotestotte: '11.05.19 - Etter egenvurdering/før møtestøtte',
        registrertEtterLanseringMotestotte: '05.06.19 - Etter lansering møtestøtte',
        registrertIDag: 'Registrert i dag',
        uke1: 'En uke siden',
        uke2: 'To uker siden',
        uke11: '11 uker siden',
        uke12: '12 uker siden',
    };

    const antallDagerEtterFastsattMeldedag = {
        [-3]: '😐 -3 (fredag)',
        [-2]: '😁 -2 Første sendedag (lørdag)',
        [-1]: '😁 -1 (Søndag)',
        0: '😁 0 Fastsatt meldedag (mandag)',
        1: '🙂 +1 (tirsdag)',
        2: '🙂 +2 (onsdag)',
        3: '🙂 +3 (torsdag)',
        4: '🙂 +4 (fredag)',
        5: '😬 +5 (lørdag)',
        6: '😬 +6 (søndag)',
        7: '🥵 +7 Siste frist (mandag)',
        8: '💸 +8 (tirsdag)',
    };

    const spraakValg = {
        nb: 'Norsk',
        en: 'Engelsk',
    };

    setFastTidspunktForIDag(hentDagRelativTilFastsattMeldedag());

    if (hentDemoState(DemoData.SKJUL_DEMO)) {
        return null;
    }
    return (
        <section className="demodashboard">
            <Heading size="xlarge" className="demo-heading">
                Demo av Veien til arbeid
            </Heading>
            <Panel className="demodashboard-innhold">
                <Grid>
                    <Cell xs={12} md={6} lg={3}>
                        <Select
                            label={'Velg geografisk tilknytning'}
                            onChange={handleChangeGeografiskTilknytning}
                            id="velg-geografisktilknytning"
                            defaultValue={hentGeografiskTilknytning()}
                        >
                            {Object.keys(geografiskeTilknytninger).map((gruppe: string) => (
                                <option key={gruppe} value={gruppe}>
                                    {geografiskeTilknytninger[gruppe]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label={'Velg rettighetsgruppe'}
                            onChange={handleChangeRettighetsgruppe}
                            id="velg-rettighetsgruppe"
                            defaultValue={hentRettighetsgruppe()}
                        >
                            {Object.keys(rettighetsgrupper).map((gruppe: string) => (
                                <option key={gruppe} value={gruppe}>
                                    {rettighetsgrupper[gruppe]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label={'Velg registreringstype'}
                            onChange={handleChangeRegistreringType}
                            id="velg-registreringtype"
                            defaultValue={hentRegistreringType()}
                        >
                            {Object.keys(registreringTyper).map((gruppe: string) => (
                                <option key={gruppe} value={gruppe}>
                                    {registreringTyper[gruppe]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label={'Velg innsatsgruppe'}
                            onChange={handleChangeServicegruppe}
                            id="velg-bruker"
                            defaultValue={hentServicegruppe()}
                        >
                            {Object.keys(servicegrupper).map((gruppe: string) => (
                                <option key={gruppe} value={gruppe}>
                                    {servicegrupper[gruppe]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label={'Velg formidlingsgruppe'}
                            onChange={handleChangeFormidlingsgruppe}
                            id="velg-formidlingsgruppe"
                            defaultValue={hentFormidlingsgruppe()}
                        >
                            {Object.keys(formidlingsgrupper).map((gruppe: string) => (
                                <option key={gruppe} value={gruppe}>
                                    {formidlingsgrupper[gruppe]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label={'Velg dagpengestatus'}
                            onChange={handleChangeDagpengeStatus}
                            id="velg-dagpengestatus"
                            defaultValue={hentDpStatus()}
                        >
                            {Object.keys(dagpengeStatuser).map((gruppe: string) => (
                                <option key={gruppe} value={gruppe}>
                                    {dagpengeStatuser[gruppe]}
                                </option>
                            ))}
                        </Select>
                    </Cell>
                    <Cell xs={12} md={6} lg={3}>
                        <Select
                            label={'Velg fremtidig situasjon'}
                            onChange={handleChangeBrukerregistrering}
                            id="velg-fremtidig-situasjon"
                            defaultValue={hentFremtidigSituasjon()}
                        >
                            {Object.keys(FremtidigSituasjonSvar).map((svar: string) => (
                                <option key={svar} value={svar}>
                                    {fremtidigeSituasjoner[svar]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label="Velg dinSituasjon"
                            onChange={handleChangeDinSituasjon}
                            id="velg-din-situasjon"
                            defaultValue={hentDinSituasjon()}
                        >
                            {Object.keys(DinSituasjonSvar).map((svar: string) => (
                                <option key={svar} value={svar}>
                                    {dineSituasjoner[svar]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label={'Velg foreslått innsatsgruppe'}
                            onChange={handleChangeForeslaattInnsatsgruppe}
                            id="velg-foreslaatt-innsatsgruppe"
                            defaultValue={hentForeslattInnsatsgruppe()}
                        >
                            {Object.keys(foreslattInnsatsgrupper).map((svar: string) => (
                                <option key={svar} value={svar}>
                                    {foreslattInnsatsgrupper[svar]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label={'Velg registreringsdato'}
                            onChange={handleChangeOpprettetRegistreringDato}
                            id="velg-opprettetdato"
                            defaultValue={hentOpprettetDato()}
                        >
                            {Object.keys(opprettetRegistreringDato).map((key: string) => (
                                <option key={key} value={opprettetRegistreringDato[key]}>
                                    {opprettetRegistreringDatoLabels[key]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label={'Dager etter fastsatt meldedag'}
                            onChange={handleChangeMeldekortdager}
                            id="velg-meldekortdager"
                            defaultValue={hentDagerEtterFastsattMeldedag()?.toString()}
                        >
                            {Object.keys(antallDagerEtterFastsattMeldedag)
                                .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
                                .map((dag: string) => (
                                    <option key={dag} value={dag}>
                                        {antallDagerEtterFastsattMeldedag[dag]}
                                    </option>
                                ))}
                        </Select>
                        <Select
                            label={'Velg kvitteringstatus'}
                            onChange={handleChangeKvitteringStatus}
                            id="velg-kvitteringstatus"
                            defaultValue={hentKvitteringStatus()}
                        >
                            {Object.keys(kvitteringsStatuser).map((gruppe: string) => (
                                <option key={gruppe} value={gruppe}>
                                    {kvitteringsStatuser[gruppe]}
                                </option>
                            ))}
                        </Select>
                        <Select
                            label="Velg språk"
                            onChange={handleChangeSprak}
                            defaultValue={hentDemoState(DemoData.SPRAK) || 'nb'}
                        >
                            {Object.keys(spraakValg).map((sprak) => (
                                <option key={sprak} value={sprak}>
                                    {spraakValg[sprak]}
                                </option>
                            ))}
                        </Select>
                    </Cell>
                    <Cell xs={6} md={6} lg={3}>
                        <Panel className="demo-checkboxpanel">
                            <CheckboxGroup
                                // onChange={handleClick}
                                legend=""
                            >
                                <Checkbox
                                    id={SYKMELDT_MED_ARBEIDSGIVER}
                                    value={SYKMELDT_MED_ARBEIDSGIVER}
                                    checked={hentSykmeldtMedArbeidsgiver()}
                                    onChange={handleClick}
                                >
                                    Sykmelding
                                </Checkbox>
                                <Checkbox
                                    id={ULESTE_DIALOGER}
                                    value={ULESTE_DIALOGER}
                                    checked={hentUlesteDialoger()}
                                    onChange={handleClick}
                                >
                                    Uleste dialoger
                                </Checkbox>
                                <Checkbox
                                    id={RESERVASJON_KRR}
                                    value={RESERVASJON_KRR}
                                    checked={hentReservasjonKRR()}
                                    onChange={handleClick}
                                >
                                    Reservasjon KRR
                                </Checkbox>
                                <Checkbox
                                    id={EGENVURDERING}
                                    value={EGENVURDERING}
                                    checked={!!hentEgenvurdering()}
                                    onChange={handleClick}
                                >
                                    Lagret egenvurdering
                                </Checkbox>
                                <Checkbox
                                    id={MOTESTOTTE}
                                    value={MOTESTOTTE}
                                    checked={!!hentMotestotte()}
                                    onChange={handleClick}
                                >
                                    Møtestøtte gjennomført
                                </Checkbox>
                                <Checkbox
                                    id={AUTENTISERINGS_INFO}
                                    value={AUTENTISERINGS_INFO}
                                    checked={hentAutentiseringsInfo().securityLevel === InnloggingsNiva.LEVEL_3}
                                    onChange={handleClick}
                                >
                                    Nivå 3
                                </Checkbox>
                                <Checkbox
                                    id={UNDER_OPPFOLGING}
                                    value={UNDER_OPPFOLGING}
                                    checked={hentUnderOppfolging().underOppfolging === true}
                                    onChange={handleClick}
                                >
                                    Under oppfølging
                                </Checkbox>
                                <Checkbox
                                    id={KAN_REAKTIVERES}
                                    value={KAN_REAKTIVERES}
                                    checked={hentKanReaktiveres()}
                                    onChange={handleClick}
                                >
                                    Kan reaktiveres
                                </Checkbox>
                                <Checkbox
                                    id={ER_UNDER_30}
                                    value={ER_UNDER_30}
                                    checked={hentAlder() < 30}
                                    onChange={handleClick}
                                >
                                    Er under 30 år
                                </Checkbox>
                            </CheckboxGroup>
                        </Panel>
                    </Cell>
                    <Cell xs={6} md={6} lg={3}>
                        <Panel className="demo-featuretoggles">
                            <CheckboxGroup legend={'Featuretoggles'}>
                                {Object.values(FeatureToggles).map((toggle) => {
                                    return (
                                        <Checkbox
                                            checked={hentDemoState(toggle) === 'true'}
                                            key={toggle}
                                            id={toggle}
                                            value={toggle}
                                            onChange={handleClick}
                                        >
                                            {prettyPrintFeatureToggle(toggle)}
                                        </Checkbox>
                                    );
                                })}
                            </CheckboxGroup>
                        </Panel>
                    </Cell>
                </Grid>
            </Panel>
        </section>
    );
};

export default DemoDashboard;
