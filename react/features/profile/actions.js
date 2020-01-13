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
import { FETCH_SESSION } from '../welcome/actionTypes';
import { appNavigate } from '../app';
import { DEFAULT_SERVER_URL } from '../base/settings';
import { exportPublic, generateKeys } from '../welcome';

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

export function toggleStatus(status) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        dispatch({
            type: TOGGLE_STATUS,
            error: undefined,
            loading: true
        });

        const headers = new Headers({
            'authorization': await AsyncStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        });

        const res = await fetch(`${DEFAULT_SERVER_URL}/module/user/config`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                userStatus: status === 'online' ? 'invisible' : 'online'
            })
        });

        if (res.ok) {
            res.json().then(config => {
                dispatch({
                    type: STORE_CONFIG,
                    config
                });

                dispatch({
                    type: TOGGLE_STATUS,
                    error: undefined,
                    loading: false
                });
            });
        } else {
            dispatch({
                type: TOGGLE_STATUS,
                error: true,
                loading: false
            });
        }
    };

}

export function syncCalendar(calendar, authorization) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        if (calendar?.length) {
            dispatch({
                type: SYNC_CALENDAR,
                error: undefined,
                loading: true
            });

            const headers = new Headers({
                'authorization': await AsyncStorage.getItem('accessToken'),
                'Content-Type': 'application/json'
            });

            const importRes = await fetch(`${DEFAULT_SERVER_URL}/module/calendar/import/apple`, {
                method: 'POST',
                headers,
                body: JSON.stringify(calendar)
            });

            dispatch({
                type: SYNC_CALENDAR,
                error: undefined,
                loading: false
            });
        }
    };
}

export function syncContacts(contacts) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        dispatch({
            type: SYNC_CONTACTS,
            error: undefined,
            loading: true
        });

        const headers = new Headers({
            'authorization': await AsyncStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        });

        const importRes = await fetch(`${DEFAULT_SERVER_URL}/module/contact/import/apple`, {
            method: 'POST',
            headers,
            body: JSON.stringify(contacts)
        });

        if (importRes.ok) {
            const [ profilesRes, friendsRes, groupsRes, configRes ] = await Promise.all([
                fetch(`${DEFAULT_SERVER_URL}/module/user/profile`, {
                    method: 'GET',
                    headers
                }),
                fetch(`${DEFAULT_SERVER_URL}/module/user/friend`, {
                    method: 'GET',
                    headers
                }),
                fetch(`${DEFAULT_SERVER_URL}/module/contact/group/group-list`, {
                    method: 'GET',
                    headers
                }),
                fetch(`${DEFAULT_SERVER_URL}/module/user/config`, {
                    method: 'GET',
                    headers
                })
            ]);

            if (profilesRes.ok && friendsRes.ok && groupsRes.ok && configRes.ok) {
                const [ profiles, friends, groups, config ] = await Promise.all([
                    profilesRes.json(),
                    friendsRes.json(),
                    groupsRes.json(),
                    configRes.json()
                ]);

                const profileIds = profiles.map(profile => profile.id);

                const defaultProfile = profiles.filter(profile => profile.default)[0];
                const otherProfiles = profiles.filter(profile => !profile.default && !profile.master);
                const friendsWithoutMe = friends.friendsList.filter(friend => !profileIds.includes(friend.profileRef));

                dispatch({
                    type: SYNC_CONTACTS,
                    loading: false,
                    error: undefined
                });

                dispatch({
                    type: FETCH_SESSION,
                    defaultProfile,
                    profiles: otherProfiles,
                    friends: friendsWithoutMe,
                    groups,
                    config
                });
            } else {
                dispatch({
                    type: SYNC_CONTACTS,
                    loading: false,
                    error: true
                });
            }
        }

        dispatch({
            type: SYNC_CONTACTS,
            error: !importRes.ok,
            loading: false
        });
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
        dispatch({
            type: CALL_FRIEND,
            loading: true,
            error: undefined
        });

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
            dispatch({
                type: CALL_FRIEND,
                loading: false,
                error: true
            });
        }
    };
}

export function changeProfile(defaultProfile) {
    return async (dispatch: Dispatch<any>, getState: Function) => {

        dispatch({
            type: CHANGE_PROFILE,
            error: undefined,
            loading: true
        });

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

                    const [ profilesRes, friendsRes, groupsRes, personalRoomRes, configRes ] = await Promise.all([
                        fetch(`${DEFAULT_SERVER_URL}/module/user/profile`, {
                            method: 'GET',
                            headers
                        }),
                        fetch(`${DEFAULT_SERVER_URL}/module/user/friend`, {
                            method: 'GET',
                            headers
                        }),
                        fetch(`${DEFAULT_SERVER_URL}/module/contact/group/group-list`, {
                            method: 'GET',
                            headers
                        }),
                        fetch(`${DEFAULT_SERVER_URL}/module/chat/conference/room`, {
                            method: 'GET',
                            headers
                        }),
                        fetch(`${DEFAULT_SERVER_URL}/module/user/config`, {
                            method: 'GET',
                            headers
                        })
                    ]);

                    if (profilesRes.ok && friendsRes.ok && groupsRes.ok && personalRoomRes.ok && configRes.ok) {
                        const [ profiles, friends, groups, personalRoom, config ] = await Promise.all([
                            profilesRes.json(),
                            friendsRes.json(),
                            groupsRes.json(),
                            personalRoomRes.json(),
                            configRes.json()
                        ]);

                        const profileIds = profiles.map(profile => profile.id);

                        const defaultProfile = profiles.filter(profile => profile.default)[0];
                        const otherProfiles = profiles.filter(profile => !profile.default && !profile.master);
                        const friendsWithoutMe = friends.friendsList.filter(friend => !profileIds.includes(friend.profileRef));

                        dispatch({
                            type: CHANGE_PROFILE,
                            loading: false,
                            error: undefined
                        });

                        dispatch({
                            type: FETCH_SESSION,
                            defaultProfile,
                            profiles: otherProfiles,
                            friends: friendsWithoutMe,
                            groups,
                            personalRoom,
                            config
                        });
                    } else {
                        dispatch({
                            type: CHANGE_PROFILE,
                            loading: false,
                            error: true
                        });
                    }
                });
            } else {
                dispatch({
                    type: CHANGE_PROFILE,
                    loading: false,
                    error: true
                });
            }
        } catch (err) {
            dispatch({
                type: CHANGE_PROFILE,
                loading: false,
                error: true
            });
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
