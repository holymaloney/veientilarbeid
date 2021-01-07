import * as React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { InnloggingsNiva } from '../../ducks/autentisering';
import { contextProviders, ProviderProps } from '../../test/test-context-providers';
import Reaktivering from './reaktivering-melding';

describe('Tester at komponenten rendres slik den skal', () => {
    test('Komponenten rendres IKKE som default', () => {
        const providerProps: ProviderProps = {};
        const { container } = render(<Reaktivering />, { wrapper: contextProviders(providerProps) });
        expect(container).toBeEmptyDOMElement();
    });

    test('Komponenten rendres dersom brukeren KAN reaktiveres og er nivå 4', async () => {
        const providerProps: ProviderProps = {
            autentisering: {
                securityLevel: InnloggingsNiva.LEVEL_4,
            },
            oppfolging: {
                kanReaktiveres: true,
            },
        };
        render(<Reaktivering />, { wrapper: contextProviders(providerProps) });
        expect(screen.getByText(/du er ikke lenger registrert som arbeidssøker hos nav/i)).toBeInTheDocument();
        expect(screen.getByText(/har du mottat dagpenger vil utbetalingene nå være stoppet\. du må registrere deg på nytt og sende inn ny søknad om dagpenger\./i)).toBeInTheDocument();
        expect(screen.getByText(/dersom du ønsker arbeidsrettet oppfølging fra NAV, må du være registrert som arbeidssøker\./i)).toBeInTheDocument();
        expect(screen.getByText(/dersom du har søkt eller ønsker å søke om dagpenger må du være registrert som arbeidssøker\./i)).toBeInTheDocument();
        expect(screen.getByText(/registrer deg som arbeidssøker/i)).toBeInTheDocument();
        expect(screen.getByText(/er du usikker på om din situasjon betyr at du bør være registrert/i)).toBeInTheDocument();
        expect(screen.getByText(/ta kontakt via dialogen/i)).toBeInTheDocument();
        expect(await screen.queryByText(/denne teksten finnes ikke/i)).not.toBeInTheDocument();
    });
});
