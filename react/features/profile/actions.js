// @flow

import {
    SET_CONTACTS_EVENTS,
    SET_CONTACTS_ERROR,
    SET_CONTACTS_AUTHORIZATION,
    SET_CONTACTS_INTEGRATION
} from './actionTypes';

export function fetchContacts(contacts) {
    return {
        type: SET_CONTACTS_EVENTS,
        contacts
    };
}


export function setContactsErrorMessage(error) {
    return {
        type: SET_CONTACTS_ERROR,
        error
    };
}


export function setContactsAuthorization(authorization) {
    return {
        type: SET_CONTACTS_AUTHORIZATION,
        authorization
    };
}


export function setContactsIntegration() {
    return {
        type: SET_CONTACTS_INTEGRATION
    };
}
