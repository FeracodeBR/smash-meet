// @flow

import {
    SET_SIDEBAR_VISIBLE,
    SET_WELCOME_PAGE_LISTS_DEFAULT_PAGE,
    SIGN_IN_RESPONSE
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
            const res = await fetch('https://staging.smashinnovations.com/module/system/authenticate',
            { method: 'POST',
                headers: new Headers({
                    Authorization: 'bFdkZXJ1VGFsdUpyY2VicmxsaWFiYW9vbG9wZW9haWwkK0dpOGd2ZkJZVnFWR3ZnV1JRVmYyVmIvQUVlTHdSVW9VaTIybXZzemhSNG0rVytScWRqZHNjd0JwTzJjUlNxTGQ3TTN0MTNleWFWeDFVUGwxQ2xBREo2bGxXbkdtZzBXVWV6cnI5aytWQ2tIQ1dBY1E5VTVjTEpJY0tMVUtEYVdkTGFJWnhMbktaUVlLZTk4a3VVQktBdVNZMjBPMUt6aGxLYldySDg3Q1kwPQ==',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ password, username })
            })

            if(res.ok) {
                dispatch({
                    type: SIGN_IN_RESPONSE,
                    error: undefined
                });

                dispatch({
                    type: 'ver rota',
                    userId: 'userId'
                });

                //dispatch navigate to route
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