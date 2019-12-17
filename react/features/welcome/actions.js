// @flow

import AsyncStorage from '@react-native-community/async-storage';

import {
    SET_SIDEBAR_VISIBLE,
    SET_WELCOME_PAGE_LISTS_DEFAULT_PAGE,
    SIGN_IN_RESPONSE,
    FETCH_PROFILES_FRIENDS_GROUPS
} from './actionTypes';

// import {}

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
        try {
            const headers = new Headers({
                'authorization': 'bFdkZXJ1VGFsdUpyY2VicmxsaWFiYW9vbG9wZW9haWwkK0dpOGd2ZkJZVnFWR3ZnV1JRVmYyVmIvQUVlTHdSVW9VaTIybXZzemhSNG0rVytScWRqZHNjd0JwTzJjUlNxTGQ3TTN0MTNleWFWeDFVUGwxQ2xBREo2bGxXbkdtZzBXVWV6cnI5aytWQ2tIQ1dBY1E5VTVjTEpJY0tMVUtEYVdkTGFJWnhMbktaUVlLZTk4a3VVQktBdVNZMjBPMUt6aGxLYldySDg3Q1kwPQ==',
                'Content-Type': 'application/json'
            });

            const auth = await fetch('https://staging.smashinnovations.com/module/system/authenticate',
            { method: 'POST',
                headers,
                body: JSON.stringify({ password, username })
            })

            console.log('auth', auth)

            if(auth.ok) {
                auth.json().then(async res => {
                    const {defaultProfile, accessToken} = res;

                    AsyncStorage.setItem('profile', defaultProfile.id)
                    AsyncStorage.setItem('accessToken', accessToken)

                    headers.set('authorization', accessToken);

                    const [profileListRes, friendListRes, groupListRes] = await Promise.all([
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
                    ])

                    if(profileListRes.ok && friendListRes.ok && groupListRes.ok) {
                        const [profileList, friendList, groupList] = await Promise.all([
                            profileListRes.json(),
                            friendListRes.json(),
                            groupListRes.json()
                        ])

                        console.log('profileList', profileList);
                        console.log('friendList', friendList);
                        console.log('groupList', groupList);

                        dispatch({
                            type: SIGN_IN_RESPONSE,
                            error: undefined
                        });

                        dispatch({
                            type: FETCH_PROFILES_FRIENDS_GROUPS,
                            profileList,
                            friendList,
                            groupList
                        });

                        //dispatch navigate to route
                    } else {
                        dispatch({
                            type: SIGN_IN_RESPONSE,
                            error: true
                        });
                    }
                });
            } else {
                dispatch({
                    type: SIGN_IN_RESPONSE,
                    error: true
                });
            }
          } catch (err) {
            console.log('err', err);

            dispatch({
                type: SIGN_IN_RESPONSE,
                error: true
            });
        }
    };
}