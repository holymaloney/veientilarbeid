import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { hentOppfolging, selectOppfolging, State as OppfolgingState } from '../../ducks/oppfolging';
import {
    hentFeatureToggles,
    selectFeatureToggles,
    selectHentServicegruppekodeFeatureToggle,
    selectHentSykeforloepMetadata,
    servicekodeToggleKey,
    State as FeatureTogglesState, sykeforloepMetadataToggleKey
} from '../../ducks/feature-toggles';
import { hentServicegruppe, selectServicegruppe, State as ServicegruppeState } from '../../ducks/servicegruppe';
import { AppState } from '../../reducer';
import Innholdslaster from '../innholdslaster/innholdslaster';
import Feilmelding from '../feilmeldinger/feilmelding';
import { selectSykeforloepMetadata, hentSykeforloepMetadata, State as SykeforloepMetadataState }
    from '../../ducks/sykeforloep-metadata';

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    oppfolging: OppfolgingState;
    featureToggles: FeatureTogglesState;
    servicegruppe: ServicegruppeState;
    sykeforloepMetadata: SykeforloepMetadataState;
    featureToggleServicegruppe: boolean;
    featureToggleSykeforloepMetadata: boolean;
}

interface DispatchProps {
    hentOppfolging: () => void;
    hentFeatureToggles: () => Promise<void | {}>;
    hentServicegruppe: () => void;
    hentSykeforloepMetadata: () => void;
}

type Props = StateProps & DispatchProps & OwnProps;

class HentInitialData extends React.Component<Props> {
    componentWillMount() {
        this.props.hentFeatureToggles().then((response) => {

            this.props.hentOppfolging();

            const featureToggleSykeforloepMetadata = response[sykeforloepMetadataToggleKey];
            if (featureToggleSykeforloepMetadata) {
                this.props.hentSykeforloepMetadata();
            }

            const featureToggleServicegruppe = response[servicekodeToggleKey];
            if (featureToggleServicegruppe) {
                this.props.hentServicegruppe();
            }
        });
    }

    finnAvhengigheter () {
        const {
            oppfolging,
            servicegruppe,
            sykeforloepMetadata,
            featureToggleServicegruppe,
            featureToggleSykeforloepMetadata,
        } = this.props;

        if (featureToggleServicegruppe && featureToggleSykeforloepMetadata) {
            return [oppfolging, servicegruppe, sykeforloepMetadata];
        } else if (featureToggleServicegruppe) {
            return [oppfolging, servicegruppe];
        } else if (featureToggleSykeforloepMetadata) {
            return [oppfolging, sykeforloepMetadata];
        } else {
            return [oppfolging];
        }
    }

    render() {
        const {
            children
        } = this.props;

        const avhengigheter = this.finnAvhengigheter();

        return (
            <Innholdslaster
                feilmeldingKomponent={<Feilmelding tekstId="feil-i-systemene-beskrivelse"/>}
                storrelse="XXL"
                avhengigheter={avhengigheter}
            >
                {children}
            </Innholdslaster>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    oppfolging: selectOppfolging(state),
    featureToggles: selectFeatureToggles(state),
    servicegruppe: selectServicegruppe(state),
    sykeforloepMetadata: selectSykeforloepMetadata(state),
    featureToggleServicegruppe: selectHentServicegruppekodeFeatureToggle(state),
    featureToggleSykeforloepMetadata: selectHentSykeforloepMetadata(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
    hentOppfolging: () => dispatch(hentOppfolging()),
    hentFeatureToggles: () => dispatch(hentFeatureToggles()),
    hentServicegruppe: () => dispatch(hentServicegruppe()),
    hentSykeforloepMetadata: () => dispatch(hentSykeforloepMetadata()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HentInitialData);
