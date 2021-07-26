import React from 'react';
import LenkepanelMedIkon from '../lenkepanel-med-ikon/lenkepanel-med-ikon';
import DesignMug from './design-mug';
import { loggAktivitet } from '../../metrics/metrics';
import { aktivitetsplanLenke } from '../../innhold/lenker';
import { AmplitudeContext } from '../../ducks/amplitude-context';
import { UnderOppfolgingContext } from '../../ducks/under-oppfolging';

const Aktivitetsplan = () => {
    const amplitudeData = React.useContext(AmplitudeContext);
    const { underOppfolging } = React.useContext(UnderOppfolgingContext).data;
    const overskrift = 'aktivitetsplan-overskrift-ordinaer';
    const ingress = 'aktivitetsplan-beskrivelse';
    const kanViseKomponent = underOppfolging;

    const handleClick = () => {
        loggAktivitet({ aktivitet: 'Går til aktivitetsplanen', ...amplitudeData });
    };

    return !kanViseKomponent ? null : (
        <LenkepanelMedIkon
            href={aktivitetsplanLenke}
            alt=""
            onClick={handleClick}
            overskrift={overskrift}
            ingress={ingress}
            className="aktivitetsplanPanel"
        >
            <DesignMug />
        </LenkepanelMedIkon>
    );
};

export default Aktivitetsplan;
