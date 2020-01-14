// @flow

import AsyncStorage from '@react-native-community/async-storage';

import {
    SET_SIDEBAR_VISIBLE,
    SET_WELCOME_PAGE_LISTS_DEFAULT_PAGE,
    SIGN_IN,
    FETCH_SESSION,
    STORE_SOCKET,
} from './actionTypes';

import {navigateToScreen, status} from "../base/app";
import {DEFAULT_SERVER_URL, DEFAULT_WEBSOCKET_URL} from "../base/settings";
import io from "socket.io-client";
import {addClient} from "../profile/actions";

/**
 * Sets the visibility of {@link WelcomePageSideBar}.
 *
 * @param {boolean} visible - If the {@code WelcomePageSideBar} is to be made
 * visible, {@code true}; otherwise, {@code false}.
 * @returns {{
 *     type: SET_SIDEBAR_VISIBLE,
 *     visible: boolean
 * }}
 */
export function setSideBarVisible(visible: boolean) {
    return {
        type: SET_SIDEBAR_VISIBLE,
        visible
    };
}

/**
 * Sets the default page index of {@link WelcomePageLists}.
 *
 * @param {number} pageIndex - The index of the default page.
 * @returns {{
 *     type: SET_WELCOME_PAGE_LISTS_DEFAULT_PAGE,
 *     pageIndex: number
 * }}
 */
export function setWelcomePageListsDefaultPage(pageIndex: number) {
    return {
        type: SET_WELCOME_PAGE_LISTS_DEFAULT_PAGE,
        pageIndex
    };
}

export async function fetchSession(dispatch, accessToken) {
    dispatch(status({
        trigger: FETCH_SESSION,
        loading: true,
        error: undefined
    }));

    const headers = new Headers({
        'authorization': accessToken,
        'Content-Type': 'application/json'
    });

    const [profilesRes, friendsRes, groupsRes, personalRoomRes, configRes] = await Promise.all([
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
            headers,
        }),
        fetch(`${DEFAULT_SERVER_URL}/module/user/config`, {
            method: 'GET',
            headers,
        })
    ]);

    if (profilesRes.ok && friendsRes.ok && groupsRes.ok && personalRoomRes.ok && configRes.ok) {
        const [profiles, friends, groups, personalRoom, config] = await Promise.all([
            profilesRes.json(),
            friendsRes.json(),
            groupsRes.json(),
            personalRoomRes.json(),
            configRes.json(),
        ]);

        const profileIds = profiles.map(profile => profile.id);

        const defaultProfile = profiles.filter(profile => profile.default)[0];
        const otherProfiles = profiles.filter(profile => !profile.default && !profile.master);
        const friendsWithoutMe = friends.friendsList.filter(friend => !profileIds.includes(friend.profileRef));

        dispatch({
            type: FETCH_SESSION,
            defaultProfile,
            profiles: otherProfiles,
            friends: friendsWithoutMe,
            groups,
            personalRoom,
            config
        });

        const socket = io(DEFAULT_WEBSOCKET_URL, {
            query: {
                token: encodeURIComponent(accessToken),
                EIO: 3,
                transport: 'websocket'
            }
        });

        dispatch({
            type: STORE_SOCKET,
            socket
        });

        socket.on('connect', () => {
            dispatch(addClient(socket.id, defaultProfile.id));
        });

        socket.on('error', (e) => {
            console.log('socket error', e);
        });

        return {
            success: true
        }
    } else {
        dispatch(status({
            trigger: FETCH_SESSION,
            loading: false,
            error: 'unable to fetch session'
        }));

        return {
            success: false
        }
    }
}

export function signIn(username: string, password: string) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        dispatch(status({
            trigger: SIGN_IN,
            loading: true,
        }));

        try {
            const headers = new Headers({
                'authorization': 'bFdkZXJ1VGFsdUpyY2VicmxsaWFiYW9vbG9wZW9haWwkK0dpOGd2ZkJZVnFWR3ZnV1JRVmYyVmIvQUVlTHdSVW9VaTIybXZzemhSNG0rVytScWRqZHNjd0JwTzJjUlNxTGQ3TTN0MTNleWFWeDFVUGwxQ2xBREo2bGxXbkdtZzBXVWV6cnI5aytWQ2tIQ1dBY1E5VTVjTEpJY0tMVUtEYVdkTGFJWnhMbktaUVlLZTk4a3VVQktBdVNZMjBPMUt6aGxLYldySDg3Q1kwPQ==',
                'Content-Type': 'application/json'
            });

            const auth = await fetch(`${DEFAULT_SERVER_URL}/module/system/authenticate`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ password, username })
            });

            if(auth.ok) {
                auth.json().then(async res => {
                    const {accessToken, userId} = res;

                    AsyncStorage.setItem('accessToken', accessToken);
                    AsyncStorage.setItem('userId', userId);

                    const fetchSessionRes = await fetchSession(dispatch, accessToken);

                    if(fetchSessionRes.success) {
                        dispatch(status({
                            trigger: SIGN_IN,
                            loading: false,
                        }));

                        dispatch(navigateToScreen('ProfileScreen'));
                    } else {
                        dispatch(status({
                            trigger: SIGN_IN,
                            loading: false,
                            error: true
                        }));
                    }
                });
            } else {
                dispatch(status({
                    trigger: SIGN_IN,
                    loading: false,
                    error: true
                }));
            }
          } catch (err) {
            console.log('err', err);

            dispatch(status({
                trigger: SIGN_IN,
                loading: true,
                error: undefined
            }));
        }
    };
}

export function reloadSession(accessToken: string) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const fetchSessionRes = await fetchSession(dispatch, accessToken);

        if(!fetchSessionRes.success) {
            AsyncStorage.clear();
            dispatch(navigateToScreen('SignIn'));
        }
    };
}
