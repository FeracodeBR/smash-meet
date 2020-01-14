// @flow

import {
    SET_CONTACTS_EVENTS,
    SET_CONTACTS_ERROR,
    SET_CONTACTS_AUTHORIZATION,
    SET_CONTACTS_INTEGRATION,
    CHANGE_PROFILE,
    SYNC_CALENDAR,
    SYNC_CONTACTS,
    CALL_FRIEND,
    STORE_CALL_DATA,
    TOGGLE_STATUS,
    STORE_CONFIG
} from './actionTypes';
import AsyncStorage from '@react-native-community/async-storage';
import { navigateToScreen } from '../base/app';
import {FETCH_SESSION, SIGN_IN, STORE_SOCKET} from '../welcome/actionTypes';
import { appNavigate } from '../app';
import {DEFAULT_SERVER_URL, DEFAULT_WEBSOCKET_URL} from '../base/settings';
import { exportPublic, generateKeys } from '../welcome';
import {status} from "../base/app";
import {fetchSession} from "../welcome/actions";
import io from "socket.io-client";

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

export function logout() {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        AsyncStorage.clear();
        dispatch(navigateToScreen('SignIn'));
    };
}

export function toggleStatus(currentStatus) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        dispatch(status({
            trigger: TOGGLE_STATUS,
            loading: true,
            error: undefined
        }));

        const headers = new Headers({
            'authorization': await AsyncStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        });

        const res = await fetch(`${DEFAULT_SERVER_URL}/module/user/config`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                userStatus: currentStatus === 'online' ? 'invisible' : 'online'
            })
        });

        if (res.ok) {
            res.json().then(config => {
                dispatch({
                    type: STORE_CONFIG,
                    config
                });

                dispatch(status({
                    trigger: TOGGLE_STATUS,
                    loading: false,
                    error: undefined
                }));
            });
        } else {
            dispatch(status({
                trigger: TOGGLE_STATUS,
                loading: false,
                error: true
            }));
        }
    };

}

export function syncCalendar(calendar, authorization) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        if (calendar?.length) {
            dispatch(status({
                trigger: SYNC_CALENDAR,
                loading: true,
                error: undefined
            }));

            const headers = new Headers({
                'authorization': await AsyncStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            });

            const importRes = await fetch(`${DEFAULT_SERVER_URL}/module/calendar/import/apple`, {
                method: 'POST',
                headers,
                body: JSON.stringify(calendar)
            });

            dispatch(status({
                trigger: SYNC_CALENDAR,
                loading: false,
                error: !importRes.ok
            }));
        }
    };
}

export function syncContacts(contacts) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        dispatch(status({
            trigger: SYNC_CONTACTS,
            loading: true,
            error: undefined
        }));

        const accessToken = await AsyncStorage.getItem('accessToken');

        const headers = new Headers({
            'authorization': accessToken,
            'Content-Type': 'application/json'
        });

        const importRes = await fetch(`${DEFAULT_SERVER_URL}/module/contact/import/apple`, {
            method: 'POST',
            headers,
            body: JSON.stringify(contacts)
        });

        if(importRes.ok) {
            const fetchSessionRes = await fetchSession(dispatch, accessToken);

            dispatch(status({
                trigger: SYNC_CONTACTS,
                loading: false,
                error: !fetchSessionRes.success
            }));
        } else {
            dispatch(status({
                trigger: SYNC_CONTACTS,
                loading: false,
                error: !importRes.ok
            }));
        }
    };
}

export function enterPersonalRoom(room) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const headers = new Headers({
            'authorization': await AsyncStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        });

        const tokenRes = await fetch(`${DEFAULT_SERVER_URL}/module/chat/conference/room/token`, {
            method: 'POST',
            headers,
            body: JSON.stringify(room)
        });

        tokenRes.json().then(({ jwt, roomId }) => {
            dispatch({
                type: STORE_CALL_DATA,
                call: {}
            });
            dispatch(appNavigate(`${roomId}?jwt=${jwt}`));
        });
    };
}

export function callFriend(friend) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        dispatch(status({
            trigger: CALL_FRIEND,
            loading: true,
            error: undefined
        }));

        const headers = new Headers({
            'authorization': await AsyncStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        });

        const callRes = await fetch(`${DEFAULT_SERVER_URL}/module/chat/conference/token`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ profileId: friend.profileRef })
        });

        if (callRes.ok) {
            callRes.json().then(call => {
                const { jwt, roomId, dateTime, sender, receiver } = call;

                dispatch({
                    type: STORE_CALL_DATA,
                    call: {
                        roomId,
                        jwt,
                        friend,
                        status: 'waiting...',
                        isCaller: true
                    }
                });

                dispatch(navigateToScreen('CallScreen'));
            });
        } else {
            dispatch(status({
                trigger: CALL_FRIEND,
                loading: false,
                error: true
            }));
        }
    };
}

export function changeProfile(defaultProfile) {
    return async (dispatch: Dispatch<any>, getState: Function) => {

        dispatch(status({
            trigger: CHANGE_PROFILE,
            loading: true,
            error: undefined
        }));

        try {
            const headers = new Headers({
                'authorization': await AsyncStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            });

            const config = await fetch(`${DEFAULT_SERVER_URL}/module/user/config`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ defaultProfile })
            });

            if (config.ok) {
                config.json().then(async res => {
                    const { accessToken } = res;

                    AsyncStorage.setItem('accessToken', accessToken);

                    headers.set('authorization', accessToken);

                    const fetchSessionRes = await fetchSession(dispatch, accessToken);

                    dispatch(status({
                        trigger: CHANGE_PROFILE,
                        loading: false,
                        error: !fetchSessionRes.success
                    }));
                });
            } else {
                dispatch(status({
                    trigger: CHANGE_PROFILE,
                    loading: false,
                    error: true
                }));
            }
        } catch (err) {
            dispatch(status({
                trigger: CHANGE_PROFILE,
                loading: false,
                error: true
            }));
        }
    };
}

export function addClient(socketId, profileId) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const [ [ , accessToken ], [ , userId ] ] = await AsyncStorage.multiGet([ 'accessToken', 'userId' ]);

        const headers = new Headers({
            'authorization': accessToken,
            'Content-Type': 'application/json'
        });

        const { publicKey, privateKey } = generateKeys();

        const res = await fetch(`${DEFAULT_SERVER_URL}/module/system/add-client`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                token: accessToken,
                userId,
                url: DEFAULT_SERVER_URL,
                profile: profileId,
                master: false,
                SameSite: 'None',
                connectionId: socketId,
                publicKey,
            })
        });

        if (!res.ok) {
            console.log('add client error', res);
        }

    };
}

export function hangup(isCaller, profileId, roomId) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const headers = new Headers({
            'authorization': await AsyncStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        });

        const res = await fetch(`${DEFAULT_SERVER_URL}/module/chat/conference/${isCaller ? 'cancel' : 'deny'}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                profileId,
                roomId
            })
        });

        if (!res.ok) {
            console.log('hangup error', res);
        }
    };
}

export function accept({ roomId, dateTime, sender, receiver, friend }, socketId) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const headers = new Headers({
            'authorization': await AsyncStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        });

        const res = await fetch(`${DEFAULT_SERVER_URL}/module/chat/conference/accept`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                call: {
                    roomId,
                    dateTime,
                    sender,
                    receiver,
                    friend
                },
                receiverConnectionId: socketId
            })
        });

        if (res.ok) {
            dispatch(appNavigate(roomId));
        } else {
            res.json().then(res => console.log('res', res));
            console.log('accept error');
        }
    };
}

export function refresh(accessToken: string) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const fetchSessionRes = await fetchSession(dispatch, accessToken);
    };
}
