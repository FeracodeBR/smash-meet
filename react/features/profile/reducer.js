// @flow

import { ReducerRegistry, set, assign } from '../base/redux';
import { PersistenceRegistry } from '../base/storage';

import {
    CLEAR_CONTACTS_INTEGRATION,
    SET_CONTACTS_AUTHORIZATION,
    SET_CONTACTS_ERROR,
    SET_CONTACTS_EVENTS,
    SET_CONTACTS_INTEGRATION,
    SET_LOADING_CONTACTS_EVENTS,
    SET_CONTACTS_AUTH_STATE,
    CHANGE_PROFILE,
    SYNC_CONTACTS,
    SYNC_CALENDAR,
    STORE_CALL_DATA,
    TOGGLE_STATUS,
    STORE_CONFIG, UPDATE_FRIENDS_STATUS, CALL_TIMEOUT
} from './actionTypes';

import { FETCH_SESSION } from '../welcome/actionTypes';

/**
 * The default state of the calendar feature.
 *
 * @type {Object}
 */
const DEFAULT_STATE = {
    authorization: undefined,
    contacts: [],
    integrationReady: false,
    integrationType: undefined,
    msAuthState: undefined,
    profiles: [],
    friends: [],
    groups: [],
    personalRoom: {},
    call: {
        roomId: '',
        jwt: '',
        friend: {}
    },
    config: {},
    loading: {},
    error: {},
    callTimeout: null,
};

/**
 * Constant for the Redux subtree of the calendar feature.
 *
 * NOTE: This feature can be disabled and in that case, accessing this subtree
 * directly will return undefined and will need a bunch of repetitive type
 * checks in other features. Make sure you take care of those checks, or
 * consider using the {@code isCalendarEnabled} value to gate features if
 * needed.
 */
const STORE_NAME = 'features/contacts-sync';

/**
 * NOTE: Never persist the authorization value as it's needed to remain a
 * runtime value to see if we need to re-request the calendar permission from
 * the user.
 */
PersistenceRegistry.register(STORE_NAME, {
    integrationType: true,
    msAuthState: true
});

ReducerRegistry.register(STORE_NAME, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case CLEAR_CONTACTS_INTEGRATION:
        return DEFAULT_STATE;

    case SET_CONTACTS_AUTH_STATE: {
        if (!action.msAuthState) {
            // received request to delete the state
            return set(state, 'msAuthState', undefined);
        }

        return set(state, 'msAuthState', {
            ...state.msAuthState,
            ...action.msAuthState
        });
    }

    case SET_CONTACTS_AUTHORIZATION:
        return set(state, 'authorization', action.authorization);

    case SET_CONTACTS_ERROR:
        return set(state, 'error', action.error);

    case SET_CONTACTS_EVENTS:
        return set(state, 'contacts', action.contacts);

    case SET_CONTACTS_INTEGRATION:
        return {
            ...state
        };

    case SET_LOADING_CONTACTS_EVENTS:
        return set(state, 'isLoadingContacts', action.isLoadingContacts);

    case FETCH_SESSION:
        return assign(state, {
            'defaultProfile': action.defaultProfile,
            'profiles': action.profiles,
            'friends': action.friends,
            'groups': action.groups,
            'personalRoom': action.personalRoom || {},
            'config': action.config
        });

    case STORE_CALL_DATA:
        return set(state, 'call', action.call);

    case STORE_CONFIG:
        return set(state, 'config', action.config);

    case CALL_TIMEOUT:
        return set(state, 'callTimeout', action.callTimeout);

    case UPDATE_FRIENDS_STATUS:
        const { profileRef, status } = action;

        const friends = state.friends.map(friend => {
            if (friend.profileRef === profileRef) {
                friend.status = status;
            }

            return friend;
        });

        return set(state, 'friends', friends);

    }

    return state;
});
