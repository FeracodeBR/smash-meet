// @flow

import {
    SET_CONTACTS_EVENTS,
    SET_CONTACTS_ERROR,
    SET_CONTACTS_AUTHORIZATION,
    SET_CONTACTS_INTEGRATION,
    CHANGE_PROFILE,
    SYNC_CALENDAR,
    SYNC_CONTACTS, CALL_FRIEND
} from './actionTypes';
import AsyncStorage from "@react-native-community/async-storage";
import {navigateToScreen} from "../base/app";
import {FETCH_PROFILES_FRIENDS_GROUPS} from "../welcome/actionTypes";
import {appNavigate} from "../app";
import {DEFAULT_SERVER_URL} from "../base/settings";

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
        dispatch(navigateToScreen('SignIn'))
    }

}

export function syncContacts(contacts) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        dispatch({
            type: SYNC_CONTACTS,
            error: undefined,
            loading: true
        });

        const headers = new Headers({
            'authorization': (await AsyncStorage.getItem('accessToken')),
            'Content-Type': 'application/json'
        });

        const importRes = await fetch(`${DEFAULT_SERVER_URL}/module/contact/import/apple`, {
            method: 'POST',
            headers,
            body: JSON.stringify(contacts)
        });

        if(importRes.ok) {
            const [profilesRes, friendsRes, groupsRes] = await Promise.all([
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
                })
            ]);

            if(profilesRes.ok && friendsRes.ok && groupsRes.ok) {
                const [profiles, friends, groups] = await Promise.all([
                    profilesRes.json(),
                    friendsRes.json(),
                    groupsRes.json()
                ]);

                const profileIds = profiles.map(profile => profile.id);

                const defaultProfile = profiles.filter(profile => profile.default)[0];
                const otherProfiles = profiles.filter(profile => !profile.default);
                const friendsWithoutMe = friends.friendsList.filter(friend => !profileIds.includes(friend.profileRef));

                dispatch({
                    type: SYNC_CONTACTS,
                    loading: false,
                    error: undefined
                });

                dispatch({
                    type: FETCH_PROFILES_FRIENDS_GROUPS,
                    defaultProfile,
                    profiles: otherProfiles,
                    friends: friendsWithoutMe,
                    groups
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
    }

}

export function enterPersonalRoom() {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const headers = new Headers({
            'authorization': (await AsyncStorage.getItem('accessToken')),
            'Content-Type': 'application/json'
        });

        const roomRes = await fetch(`${DEFAULT_SERVER_URL}/module/chat/conference/room`, {
            method: 'GET',
            headers,
        });

        if(roomRes.ok) {
            roomRes.json().then(async room => {
                const tokenRes = await fetch(`${DEFAULT_SERVER_URL}/module/chat/conference/room/token`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(room)
                });

                tokenRes.json().then(({jwt, roomId}) => {
                    dispatch(appNavigate(`${roomId}?jwt=${jwt}`))
                })
            })
        }
    }
}

export function callFriend(profileId) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        dispatch({
            type: CALL_FRIEND,
            loading: true,
            error: undefined
        });

        const headers = new Headers({
            'authorization': (await AsyncStorage.getItem('accessToken')),
            'Content-Type': 'application/json'
        });

        const callRes = await fetch(`${DEFAULT_SERVER_URL}/module/chat/conference/token`, {
            method: 'POST',
            headers,
            body: JSON.stringify({profileId})
        });

        if(callRes.ok) {
            callRes.json().then(call => {
                const {jwt, roomId, dateTime, sender, receiver} = call;

                dispatch(appNavigate(`${roomId}?jwt=${jwt}`))
            })
        } else {
            dispatch({
                type: CALL_FRIEND,
                loading: false,
                error: true
            })
        }
    }
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
                'authorization': (await AsyncStorage.getItem('accessToken')),
                'Content-Type': 'application/json'
            });

            const config = await fetch(`${DEFAULT_SERVER_URL}/module/user/config`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ defaultProfile })
            });

            if(config.ok) {
                config.json().then(async res => {
                    const {accessToken} = res;

                    AsyncStorage.setItem('accessToken', accessToken);

                    headers.set('authorization', accessToken);

                    const [profilesRes, friendsRes, groupsRes] = await Promise.all([
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
                        })
                    ]);

                    if(profilesRes.ok && friendsRes.ok && groupsRes.ok) {
                        const [profiles, friends, groups] = await Promise.all([
                            profilesRes.json(),
                            friendsRes.json(),
                            groupsRes.json()
                        ]);

                        const profileIds = profiles.map(profile => profile.id);

                        const defaultProfile = profiles.filter(profile => profile.default)[0];
                        const otherProfiles = profiles.filter(profile => !profile.default);
                        const friendsWithoutMe = friends.friendsList.filter(friend => !profileIds.includes(friend.profileRef));

                        dispatch({
                            type: CHANGE_PROFILE,
                            loading: false,
                            error: undefined
                        });

                        dispatch({
                            type: FETCH_PROFILES_FRIENDS_GROUPS,
                            defaultProfile,
                            profiles: otherProfiles,
                            friends: friendsWithoutMe,
                            groups
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
            console.log('err', err);

            dispatch({
                type: CHANGE_PROFILE,
                loading: false,
                error: true
            });
        }
    };
}
