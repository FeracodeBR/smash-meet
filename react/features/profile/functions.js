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

export function getProfileColor(color) {
    // console.log('renderizou');
    switch(color) {
        case 'linear-gradient(180deg, #FFCD02 0%, #D79B00 100%)': return '#edb702';
        case 'linear-gradient(180deg, #8AFFBB 0%, #3FA369 100%)': return 'rgb(105, 214, 151)';
        default: return color;
    }
}
