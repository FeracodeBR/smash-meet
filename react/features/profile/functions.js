// @flow

import { PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';
import type { Store } from 'redux';

import {
    fetchContacts,
    setContactsAuthorization,
    setContactsErrorMessage
} from './actions';

export function _fetchContacts(
        store: Store<*, *>) {
    const { dispatch, getState } = store;
    const hasContactsPermision = getState()['features/contacts-sync'].authorization;

    if (!hasContactsPermision) {
        _ensureContactsAccess(dispatch);
    }

    Contacts.getAll((err, contacts) => {
        if (err) {
            return dispatch(setContactsErrorMessage(err));
        }
        dispatch(fetchContacts(contacts));
    });
}

function _ensureContactsAccess(dispatch) {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'ios') {
            Contacts.checkPermission((err, permission) => {
                if (err) {
                    reject(err);

                    return dispatch(setContactsErrorMessage(err));
                }
                if (permission === 'authorized') {
                    dispatch(setContactsAuthorization(true));
                    resolve(permission);
                }
            });
        } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                'title': 'Contacts',
                'message': 'This app would like to view your contacts.'
            }
            ).then(permission => {
                if (permission === 'granted') {
                    dispatch(setContactsAuthorization(true));
                }
            });
        }
    });
}
