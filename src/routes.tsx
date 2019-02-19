import * as React from 'react';
import SjekkOppfolging from './komponenter/hent-initial-data/sjekk-oppfolging';
import { connect } from 'react-redux';
import { AppState } from './reducer';
import { selectSykmeldtInfo, State as SykmeldtInfoState } from './ducks/sykmeldt-info';
import StartsideSykmeldt from './sider/startside-sykmeldt/startside-sykmeldt';
import StartsideOrdinaer from './sider/startside-ordinaer/startside-ordinaer';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';
import { seVeientilarbeid } from './metrics';

interface StateProps {
    sykmeldtInfo: SykmeldtInfoState;
}

type AllProps = StateProps & RouteComponentProps<any>; // tslint:disable-line

class Routes extends React.Component<AllProps> {

    componentDidMount() {
        const erSykmeldtMedArbeidsgiver = this.props.sykmeldtInfo.data.erSykmeldtMedArbeidsgiver;
        seVeientilarbeid(erSykmeldtMedArbeidsgiver);
    }

    render() {
        const erSykmeldtMedArbeidsgiver = this.props.sykmeldtInfo.data.erSykmeldtMedArbeidsgiver;
        const { location } = this.props;
        const path = location.pathname;

        if (erSykmeldtMedArbeidsgiver === true) {
            return (
                <Switch>
                    <Route path={path} exact={true} component={StartsideSykmeldt}/>
                </Switch>
            );
        } else {
            return (
                <SjekkOppfolging>
                    <Route path={path} exact={true} component={StartsideOrdinaer}/>
                </SjekkOppfolging>
            );
        }
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    sykmeldtInfo: selectSykmeldtInfo(state),
});

export default connect(mapStateToProps, null, null, {pure: false})(withRouter(Routes));
