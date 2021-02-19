import { ForeslattInnsatsgruppe, FremtidigSituasjonSvar } from '../ducks/brukerregistrering'
import { Servicegruppe, Formidlingsgruppe } from '../ducks/oppfolging'
import erStandardInnsatsgruppe from './er-standard-innsatsgruppe'

const grunnData = {
  brukerregistreringData: {
    opprettetDato: new Date().toISOString(),
    manueltRegistrertAv: null,
    besvarelse: {
      dinSituasjon: null,
      fremtidigSituasjon: FremtidigSituasjonSvar.USIKKER, 
      sisteStilling: null,
      tilbakeIArbeid: null,
      andreForhold: null,
      helseHinder: null,
      utdanning: null,
      utdanningBestatt: null,
      utdanningGodkjent: null,
      teksterForBesvarelse: null
    },
    teksterForBesvarelse: null
  },
  oppfolgingData: {
    kanReaktiveres: false,
    reservasjonKRR: false,
    servicegruppe: Servicegruppe.IKVAL,
    formidlingsgruppe: Formidlingsgruppe.ARBS,

  }
}

describe('tester funksjonaliteten for erStandardInnsatsgruppe', () => {
  test('returnerer true for ARBS + IKVAL', () => {
    const testData = {...grunnData}  
    expect(erStandardInnsatsgruppe(testData)).toBe(true)
  })

  test('returnerer true for ARBS + IVURD og profilering lik STANDARD_INNSATS', () => {
    const lokaleData = {
      brukerregistreringData: {
        opprettetDato: new Date().toISOString(),
        manueltRegistrertAv: null,
        besvarelse: {
          dinSituasjon: null,
          fremtidigSituasjon: FremtidigSituasjonSvar.USIKKER, 
          sisteStilling: null,
          tilbakeIArbeid: null,
          andreForhold: null,
          helseHinder: null,
          utdanning: null,
          utdanningBestatt: null,
          utdanningGodkjent: null,
          teksterForBesvarelse: null
        },
        teksterForBesvarelse: null,
        profilering: {
          innsatsgruppe: ForeslattInnsatsgruppe.STANDARD_INNSATS
        }
      },
      oppfolgingData: {
        kanReaktiveres: false,
        reservasjonKRR: false,
        servicegruppe: Servicegruppe.IVURD,
        formidlingsgruppe: Formidlingsgruppe.ARBS,
      }
    }
    const testData = {...grunnData, ...lokaleData}
    expect(erStandardInnsatsgruppe(testData)).toBe(true)
  })

  test('returnerer false for ARBS + IVURD og profilering lik BEHOV_FOR_ARBEIDSEVNEVURDERING', () => {
    const lokaleData = {
      brukerregistreringData: {
        opprettetDato: new Date().toISOString(),
        manueltRegistrertAv: null,
        besvarelse: {
          dinSituasjon: null,
          fremtidigSituasjon: FremtidigSituasjonSvar.USIKKER, 
          sisteStilling: null,
          tilbakeIArbeid: null,
          andreForhold: null,
          helseHinder: null,
          utdanning: null,
          utdanningBestatt: null,
          utdanningGodkjent: null,
          teksterForBesvarelse: null
        },
        teksterForBesvarelse: null,
        profilering: {
          innsatsgruppe: ForeslattInnsatsgruppe.BEHOV_FOR_ARBEIDSEVNEVURDERING
        }
      },
      oppfolgingData: {
        kanReaktiveres: false,
        reservasjonKRR: false,
        servicegruppe: Servicegruppe.IVURD,
        formidlingsgruppe: Formidlingsgruppe.ARBS,
      }
    }
    const testData = {...grunnData, ...lokaleData}
    expect(erStandardInnsatsgruppe(testData)).toBe(false)
  })

  test('returnerer false for ARBS + IVURD og ingen profilering', () => {
    const lokaleData = {
      oppfolgingData: {
        kanReaktiveres: false,
        reservasjonKRR: false,
        servicegruppe: Servicegruppe.IVURD,
        formidlingsgruppe: Formidlingsgruppe.ARBS,
      }
    }
    const testData = {...grunnData, ...lokaleData}
    expect(erStandardInnsatsgruppe(testData)).toBe(false)
  })
})