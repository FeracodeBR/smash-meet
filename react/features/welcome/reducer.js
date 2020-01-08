// @flow

import { ReducerRegistry, set, assign } from '../base/redux';
import { PersistenceRegistry } from '../base/storage';

import {
    SET_SIDEBAR_VISIBLE,
    SET_WELCOME_PAGE_LISTS_DEFAULT_PAGE,
    SIGN_IN_RESPONSE,
    STORE_SOCKET
} from './actionTypes';

/**
 * The name of the redux store/state property which is the root of the redux
 * state of the feature {@code welcome}.
 */
const STORE_NAME = 'features/welcome';

/**
 * Sets up the persistence of the feature {@code welcome}.
 */
PersistenceRegistry.register(STORE_NAME, {
    defaultPage: true,
});

/**
 * Reduces redux actions for the purposes of the feature {@code welcome}.
 */
ReducerRegistry.register(STORE_NAME, (state = {}, action) => {
    switch (action.type) {
    case SET_SIDEBAR_VISIBLE:
        return set(state, 'sideBarVisible', action.visible);

    case SET_WELCOME_PAGE_LISTS_DEFAULT_PAGE:
        return set(state, 'defaultPage', action.pageIndex);

    case SIGN_IN_RESPONSE:
        return assign(state, {
            error: action.error,
            loading: action.loading,
        });

    case STORE_SOCKET:
        return set(state, 'socket', action.socket);

    }


    return state;
});
