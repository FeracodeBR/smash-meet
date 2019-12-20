// @flow

import {
    SET_CONTACTS_EVENTS,
    SET_CONTACTS_ERROR,
    SET_CONTACTS_AUTHORIZATION,
    SET_CONTACTS_INTEGRATION,
    CHANGE_PROFILE,
    FETCH_FRIENDS_GROUPS
} from './actionTypes';
import AsyncStorage from "@react-native-community/async-storage";
import {navigateToScreen} from "../base/app";
import {FETCH_PROFILES_FRIENDS_GROUPS} from "../welcome/actionTypes";
import {appNavigate} from "../app";

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

export function enterPersonalRoom() {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const headers = new Headers({
            'authorization': (await AsyncStorage.getItem('accessToken')),
            'Content-Type': 'application/json'
        });

        const roomRes = await fetch('https://staging.smashinnovations.com/module/chat/conference/room', {
            method: 'GET',
            headers,
        });

        if(roomRes.ok) {
            roomRes.json().then(async room => {
                const tokenRes = await fetch('https://staging.smashinnovations.com/module/chat/conference/room/token', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(room)
                });

                tokenRes.json().then(({jwt, roomId}) => {
                    // console.log('token', token);

                    // dispatch(appNavigate(`${roomId}?jwt=${jwt}`))
                    dispatch(appNavigate(`${roomId}`))
                })
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

            const config = await fetch('https://staging.smashinnovations.com/module/user/config', {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ defaultProfile })
                });

            console.log('config', config);

            if(config.ok) {
                config.json().then(async res => {
                    const {defaultProfile, accessToken} = res;

                    AsyncStorage.setItem('profile', defaultProfile.id);
                    AsyncStorage.setItem('accessToken', accessToken);

                    headers.set('authorization', accessToken);

                    const [profilesRes, friendsRes, groupsRes] = await Promise.all([
                        fetch('https://staging.smashinnovations.com/module/user/profile', {
                            method: 'GET',
                            headers
                        }),
                        fetch('https://staging.smashinnovations.com/module/user/friend', {
                            method: 'GET',
                            headers
                        }),
                        fetch('https://staging.smashinnovations.com/module/contact/group/group-list', {
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

                        const defaultProfile = profiles.filter(profile => profile.default)[0];
                        const otherProfiles = profiles.filter(profile => !profile.default);
                        const friendsWithoutMe = friends.friendsList.filter(friend => friend.profileRef !== friends.profileRef);

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
