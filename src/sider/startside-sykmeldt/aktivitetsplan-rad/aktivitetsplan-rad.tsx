import * as React from 'react';
import Aktivitetsplan from '../../../komponenter/aktivitetsplan/aktivitetsplan';
import './aktivitetsplan-rad.less';

const AktivitetsplanRad = () => {
    return (
        <div className="aktivitetsplan-rad">
            <Aktivitetsplan erBrukerSykmeldt={true}/>
        </div>
    );
};

export default AktivitetsplanRad;