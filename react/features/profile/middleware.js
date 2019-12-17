// @flow

import { MiddlewareRegistry } from '../base/redux';

import { SET_CONTACTS_INTEGRATION } from './actionTypes';
import { _fetchContacts } from './functions';

MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {
    case SET_CONTACTS_INTEGRATION: {
        const result = next(action);

        _fetchContacts(store);

        return result;
    }
    }

    return next(action);
});
