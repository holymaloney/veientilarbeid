import { DinSituasjonSvar, FremtidigSituasjonSvar } from '../ducks/brukerregistrering';
import { InnloggingsNiva } from '../ducks/autentisering';
import { plussDager } from '../utils/date-utils';
import { POAGruppe } from '../utils/get-poa-group';
import { kanViseOnboarding14A } from './kan-vise-onboarding14a';
import { Formidlingsgruppe, Servicegruppe } from '../ducks/oppfolging';

const poagruppeKSS: POAGruppe = 'kss';
const dpVenter: 'nei' = 'nei';

const grunndata = {
    brukerInfoData: {
        rettighetsgruppe: 'DAGP',
        geografiskTilknytning: '110302',
        alder: 42,
        erSykmeldtMedArbeidsgiver: false,
    },
    oppfolgingData: {
        formidlingsgruppe: Formidlingsgruppe.ARBS,
        servicegruppe: Servicegruppe.IKVAL,
        kanReaktiveres: false,
        reservasjonKRR: false,
    },
    registreringData: {
        registrering: {
            opprettetDato: plussDager(new Date(), -78).toISOString(),
            manueltRegistrertAv: null,
            besvarelse: {
                dinSituasjon: DinSituasjonSvar.MISTET_JOBBEN,
                fremtidigSituasjon: FremtidigSituasjonSvar.INGEN_PASSER,
                sisteStilling: '',
                tilbakeIArbeid: '',
                andreForhold: '',
                helseHinder: '',
                utdanning: '',
                utdanningBestatt: '',
                utdanningGodkjent: '',
            },
            teksterForBesvarelse: [],
        },
    },
    egenvurderingData: {
        sistOppdatert: plussDager(new Date(), -78).toISOString(),
    },
    featuretoggleData: {
        'veientilarbeid.modal': false,
        'veientilarbeid.feedback': false,
        'veientilarbeid.14a-intro': true,
        'veientilarbeid.registrert-permittert': false,
        'veientilarbeid.dagpenger-status': false,
        'veientilarbeid.dpstatus-for-alle': false,
        'veientilarbeid.egenvurderinguke12': true,
        'veientilarbeid.rydding.skjulJobbBoks': false,
        'veientilarbeid.rydding.skjulOkonomiBoks': false,
        'veientilarbeid.rydding.skjulAAPRad': false,
        'veientilarbeid.visbrukerundersokelse': false,
        'veientilarbeid.onboarding14a.situasjonsbestemt': false,
        'veientilarbeid.meldekort-intro.situasjonsbestemt': false,
    },
    amplitudeData: {
        gruppe: poagruppeKSS,
        geografiskTilknytning: 'INGEN_VERDI',
        isKSSX: 'nei',
        isKSSK: 'nei',
        erSamarbeidskontor: 'nei',
        ukerRegistrert: 11,
        dagerRegistrert: 78,
        nivaa: InnloggingsNiva.LEVEL_4,
        kanReaktiveres: 'nei',
        formidlingsgruppe: 'INGEN_VERDI',
        servicegruppe: 'IVURD',
        rettighetsgruppe: 'INGEN_VERDI',
        meldegruppe: 'INGEN_VERDI',
        registreringType: 'INGEN_VERDI',
        underOppfolging: 'nei',
        antallDagerEtterFastsattMeldingsdag: 'ikke meldekortbruker',
        antallMeldekortKlareForLevering: 0,
        gitVersion: 'INGEN_VERDI',
        buildTimestamp: new Date().toISOString(),
        antallSynligeInfomeldinger: 0,
        erSykmeldtMedArbeidsgiver: 'ukjent',
        dinSituasjon: DinSituasjonSvar.INGEN_VERDI,
        reservasjonKRR: 'ukjent',
        dagpengerVedleggEttersendes: 0,
        dagpengerSoknadMellomlagret: 0,
        dagpengerSoknadVenterPaSvar: dpVenter,
        dagpengerDagerMellomPaabegyntSoknadOgRegistrering: 0,
        dagpengerDagerMellomInnsendtSoknadOgRegistrering: 0,
        dagpengerStatusBeregning: 'INGEN_DATA',
    },
    sistVistFraLocalstorage: 0,
};

describe('Tester funksjonen kanViseOnboarding14A', () => {
    test('Nei hvis AAP', () => {
        const testdata = JSON.parse(JSON.stringify(grunndata));
        testdata.brukerInfoData.rettighetsgruppe = 'AAP';
        expect(kanViseOnboarding14A(testdata)).toBe(false);
    });

    test('NEI hvis ikke innefor aldersgruppe', () => {
        const testdata = JSON.parse(JSON.stringify(grunndata));
        testdata.brukerInfoData.alder = 56;
        expect(kanViseOnboarding14A(testdata)).toBe(false);
    });

    test('NEI hvis ikke featureToggle', () => {
        const testdata = JSON.parse(JSON.stringify(grunndata));
        testdata.featuretoggleData['veientilarbeid.14a-intro'] = false;
        expect(kanViseOnboarding14A(testdata)).toBe(false);
    });

    test('NEI hvis ikke bruker kan reaktveres', () => {
        const testdata = JSON.parse(JSON.stringify(grunndata));
        testdata.oppfolgingData.kanReaktiveres = true;
        expect(kanViseOnboarding14A(testdata)).toBe(false);
    });

    test('NEI hvis ikke bruker ikke er standard innsatsgruppe', () => {
        const testdata = JSON.parse(JSON.stringify(grunndata));
        testdata.oppfolgingData.servicegruppe = 'BKART';
        expect(kanViseOnboarding14A(testdata)).toBe(false);
    });

    test('JA hvis ikke bruker er innefor aldersgruppe, har featuretoggle, ikke kan reaktivers og er standard innsatsgruppe', () => {
        const testdata = JSON.parse(JSON.stringify(grunndata));
        testdata.brukerInfoData.alder = 45;
        testdata.featuretoggleData['veientilarbeid.14a-intro'] = true;
        testdata.oppfolgingData.kanReaktiveres = false;
        testdata.oppfolgingData.servicegruppe = 'IKVAL';
        testdata.oppfolgingData.formidlingsgruppe = 'ARBS';

        expect(kanViseOnboarding14A(testdata)).toBe(true);
    });
});
