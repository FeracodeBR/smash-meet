// @flow

import AsyncStorage from '@react-native-community/async-storage';

import {
    SET_SIDEBAR_VISIBLE,
    SET_WELCOME_PAGE_LISTS_DEFAULT_PAGE,
    SIGN_IN_RESPONSE,
    FETCH_PROFILES_FRIENDS_GROUPS
} from './actionTypes';

import {navigateToScreen} from "../base/app";

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

/* eslint-disable */
export function signIn(username: string, password: string) {
    return async (dispatch: Dispatch<any>, getState: Function) => {

        dispatch({
            type: SIGN_IN_RESPONSE,
            error: undefined,
            loading: true
        });

        try {
            const headers = new Headers({
                'authorization': 'bFdkZXJ1VGFsdUpyY2VicmxsaWFiYW9vbG9wZW9haWwkK0dpOGd2ZkJZVnFWR3ZnV1JRVmYyVmIvQUVlTHdSVW9VaTIybXZzemhSNG0rVytScWRqZHNjd0JwTzJjUlNxTGQ3TTN0MTNleWFWeDFVUGwxQ2xBREo2bGxXbkdtZzBXVWV6cnI5aytWQ2tIQ1dBY1E5VTVjTEpJY0tMVUtEYVdkTGFJWnhMbktaUVlLZTk4a3VVQktBdVNZMjBPMUt6aGxLYldySDg3Q1kwPQ==',
                'Content-Type': 'application/json'
            });

            const auth = await fetch('https://staging.smashinnovations.com/module/system/authenticate',
            { method: 'POST',
                headers,
                body: JSON.stringify({ password, username })
            });

            console.log('auth', auth);

            if(auth.ok) {
                auth.json().then(async res => {
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
                            type: SIGN_IN_RESPONSE,
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

                        dispatch(navigateToScreen('ProfileScreen'));
                    } else {
                        dispatch({
                            type: SIGN_IN_RESPONSE,
                            loading: false,
                            error: true
                        });
                    }
                });
            } else {
                dispatch({
                    type: SIGN_IN_RESPONSE,
                    loading: false,
                    error: true
                });
            }
          } catch (err) {
            console.log('err', err);

            dispatch({
                type: SIGN_IN_RESPONSE,
                loading: false,
                error: true
            });
        }
    };
}
