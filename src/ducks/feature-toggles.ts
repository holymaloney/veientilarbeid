import * as React from 'react';
import { DataElement, STATUS } from './api';

export enum FeatureToggles {
    MODAL = 'veientilarbeid.modal',
    INTRO_FEEDBACK = 'veientilarbeid.feedback',
    INTRO_14A = 'veientilarbeid.14a-intro',
    REGISTRERT_PERMITTERT = 'veientilarbeid.registrert-permittert',
    DAGPENGER_STATUS = 'dagpenger-status',
}

export function prettyPrintFeatureToggle(toggle: FeatureToggles) {
    switch (toggle) {
        case FeatureToggles.MODAL:
            return '14a-modal';
        case FeatureToggles.INTRO_14A:
            return '14a-intro';
        case FeatureToggles.INTRO_FEEDBACK:
            return 'Intro feedback';
        case FeatureToggles.REGISTRERT_PERMITTERT:
            return 'Registrert som permittert';
        case FeatureToggles.DAGPENGER_STATUS:
            return 'Dagpenger status';
    }
}

export interface Data {
    'veientilarbeid.modal': boolean;
    'veientilarbeid.feedback': boolean;
    'veientilarbeid.14a-intro': boolean;
    'veientilarbeid.registrert-permittert': boolean;
    'veientilarbeid.dagpenger-status': boolean;
}

export interface State extends DataElement {
    data: Data;
}

export const initialState: State = {
    data: {
        'veientilarbeid.modal': false,
        'veientilarbeid.feedback': false,
        'veientilarbeid.14a-intro': false,
        'veientilarbeid.registrert-permittert': false,
        'veientilarbeid.dagpenger-status': false,
    },
    status: STATUS.NOT_STARTED,
};

export const FeaturetoggleContext = React.createContext<State>(initialState);
