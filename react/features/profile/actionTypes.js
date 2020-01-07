// @flow

/**
 * Resets the state of contacts integration so stored events and selected
 * calendar type are cleared.
 *
 * {
 *     type: CLEAR_CONTACTS_INTEGRATION
 * }
 */
export const CLEAR_CONTACTS_INTEGRATION = 'CLEAR_CONTACTS_INTEGRATION';

/**
 * Action to signal that calendar access has already been requested since the
 * app started, so no new request should be done unless the user explicitly
 * tries to refresh the calendar view.
 *
 * {
 *     type: SET_CONTACTS_AUTHORIZATION,
 *     authorization: ?string
 * }
 */
export const SET_CONTACTS_AUTHORIZATION = 'SET_CONTACTS_AUTHORIZATION';

/**
 * Action to update the last error that occurred while trying to authenticate
 * with or fetch data from the calendar integration.
 *
 * {
 *     type: SET_CALENDAR_ERROR,
 *     error: ?Object
 * }
 */
export const SET_CONTACTS_ERROR = 'SET_CONTACTS_ERROR';

/**
 * Action to update the current calendar entry list in the store.
 *
 * {
 *     type: SET_CONTACTS_EVENTS,
 *     events: Array<Object>
 * }
 */
export const SET_CONTACTS_EVENTS = 'SET_CONTACTS_EVENTS';

/**
 * Action to update calendar type to be used for web.
 *
 * {
 *     type: SET_CONTACTS_INTEGRATION,
 *     integrationReady: boolean,
 *     integrationType: string
 * }
 */
export const SET_CONTACTS_INTEGRATION = 'SET_CONTACTS_INTEGRATION';

/**
 * The type of Redux action which changes Calendar API auth state.
 *
 * {
 *     type: SET_CONTACTS_AUTH_STATE
 * }
 * @public
 */
export const SET_CONTACTS_AUTH_STATE = 'SET_CONTACTS_AUTH_STATE';

/**
 * The type of Redux action which denotes whether a request is in flight to get
 * updated calendar events.
 *
 * {
 *     type: SET_LOADING_CALENDAR_EVENTS,
 *     isLoadingEvents: string
 * }
 * @public
 */
export const SET_LOADING_CONTACTS_EVENTS
    = 'SET_LOADING_CONTACTS_EVENTS';

export const CHANGE_PROFILE = 'CHANGE_PROFILE';
export const SYNC_CALENDAR = 'SYNC_CALENDAR';
export const SYNC_CONTACTS = 'SYNC_CONTACTS';
export const CALL_FRIEND = 'CALL_FRIEND';
export const STORE_CALL_DATA = 'STORE_CALL_DATA';
export const TOGGLE_STATUS = 'TOGGLE_STATUS';
export const STORE_CONFIG = 'STORE_CONFIG';

