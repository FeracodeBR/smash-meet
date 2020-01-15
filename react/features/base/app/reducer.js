// @flow

import {ReducerRegistry} from '../redux';

import {APP_WILL_MOUNT, APP_WILL_UNMOUNT, APP_WILL_NAVIGATE, STATUS} from './actionTypes';
import {WEBSOCKET_CONNECT} from "../../websocket/actionTypes";

const DEFAULT_STATE = {
    loading: {},
    error: {},
    wsConnected: false,
};

ReducerRegistry.register('features/base/app', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case APP_WILL_NAVIGATE: {
            const {route} = action;

            return {
                ...state,
                route
            };
        }
        case APP_WILL_MOUNT: {
            const {app} = action;

            if (state.app !== app) {
                return {
                    ...state,

                    /**
                     * The one and only (i.e. singleton) {@link BaseApp} instance
                     * which is currently mounted.
                     *
                     * @type {BaseApp}
                     */
                    app
                };
            }
            break;
        }

        case APP_WILL_UNMOUNT:
            if (state.app === action.app) {
                return {
                    ...state,
                    app: undefined
                };
            }
            break;

        case STATUS:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.trigger]: action.loading
                },
                error: {
                    ...state.error,
                    [action.trigger]: action.error
                }
            };

        case WEBSOCKET_CONNECT:
            return {
                ...state,
                wsConnected: action.wsConnected
            }

    }

    return state;
});
