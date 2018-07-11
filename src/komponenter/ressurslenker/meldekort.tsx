import * as React from 'react';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Lenkepanel from 'nav-frontend-lenkepanel';

const hvordansokejobber = require('./meldekort.svg');

export const MELDEKORT_URL = 'https://www.nav.no/no/Person/Arbeid/Dagpenger+ved+arbeidsloshet+og+permittering/Meldekort+hvordan+gjor+du+det/Slik+sender+du+elektroniske+meldekort'; // tslint:disable-line

class Meldekort extends React.Component {
    render() {
        return (
            <Lenkepanel className="ressurslenke" href={MELDEKORT_URL}>
                <img
                    src={hvordansokejobber}
                    alt="Konvolutt med brev"
                    className="ressurslenke__illustrasjon"
                />
                <div className="ressurslenke__tekst">
                    <Systemtittel className="blokk-xs">
                        <FormattedMessage id="overskrift-meldekort"/>
                    </Systemtittel>
                    <Element>
                        <FormattedMessage id="beskrivelse-meldekort"/>
                    </Element>
                </div>
            </Lenkepanel>
        );
    }
}

export default Meldekort;