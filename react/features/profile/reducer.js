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
    SYNC_CONTACTS
} from './actionTypes';

import {FETCH_PROFILES_FRIENDS_GROUPS} from "../welcome/actionTypes";

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
    loading: {},
    error: {}
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

    case CHANGE_PROFILE:
        return assign(state, {
            loading: {
                ...state.loading,
                [action.type]: action.loading
            },
            error: {
                ...state.error,
                [action.type]: action.error
            },
        });

    case SYNC_CONTACTS:
        return assign(state, {
            loading: {
                ...state.loading,
                [action.type]: action.loading
            },
            error: {
                ...state.error,
                [action.type]: action.error
            },
        });

    case FETCH_PROFILES_FRIENDS_GROUPS:
        return assign(state, {
            'defaultProfile': action.defaultProfile,
            'profiles': action.profiles,
            // 'profiles': [
            //     {
            //         id: "1",
            //         profileType: "private",
            //         profile: "Master Profile",
            //         name: "thiagoSTG20",
            //         picture: "",
            //         email: "thiagoSTG20@thiagoSTG20.com",
            //         address: "",
            //         master: true,
            //         default: true,
            //         abbr: "MAS",
            //         color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
            //         company: "",
            //         jobTitle: "",
            //     },
            //     {
            //         id: "12",
            //         profileType: "private",
            //         profile: "Master Profile",
            //         name: "thiagoSTG20",
            //         picture: "",
            //         email: "thiagoSTG20@thiagoSTG20.com",
            //         address: "",
            //         master: true,
            //         default: false,
            //         abbr: "MAS",
            //         color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
            //         company: "",
            //         jobTitle: "",
            //     },
            //     {
            //         id: "13",
            //         profileType: "private",
            //         profile: "Master Profile",
            //         name: "thiagoSTG20",
            //         picture: "",
            //         email: "thiagoSTG20@thiagoSTG20.com",
            //         address: "",
            //         master: true,
            //         default: false,
            //         abbr: "MAS",
            //         color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
            //         company: "",
            //         jobTitle: "",
            //     },
                // {
                //     id: "41",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "51",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "6",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "17",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "18",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "19",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "20",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "21",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "22",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "23",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
                // {
                //     id: "24",
                //     profileType: "private",
                //     profile: "Master Profile",
                //     name: "thiagoSTG20",
                //     picture: "",
                //     email: "thiagoSTG20@thiagoSTG20.com",
                //     address: "",
                //     master: true,
                //     default: false,
                //     abbr: "MAS",
                //     color: "linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)",
                //     company: "",
                //     jobTitle: "",
                // },
            // ],
            'friends': action.friends,
            'groups': action.groups,
        });


    }

    return state;
});
