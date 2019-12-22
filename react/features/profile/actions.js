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
import {setCalendarIntegration} from "../calendar-sync";

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

export function syncCalendar(calendar, authorization) {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        if(authorization) {
            dispatch({
                type: SYNC_CALENDAR,
                error: undefined,
                loading: true
            });

            const headers = new Headers({
                'authorization': (await AsyncStorage.getItem('accessToken')),
                'Content-Type': 'application/json'
            });

            const promises = [];

            for(const event in calendar) {
                const {allDay, endDate, startDate, title} = event;

                const start = new Date(startDate);
                const end = new Date(endDate);

                const utc = start.match(/([A-Z]+[\+-][0-9]+)/)[1].substring(3);
                const charsBefore = utc.indexOf('-') > 0 ? utc.substring(0, utc.length) : utc.substring(0, utc.length - 1);
                const charsAfter = utc.substring(utc.length, utc.length + 2);
                const formattedUTC = `${charsBefore}:${charsAfter}`;

                // falta UTC ZONE e UTC TITLE

                promises.push(
                    fetch(`${DEFAULT_SERVER_URL}/module/calendar/event`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            title,
                            allDay,
                            "@type": "calendar-event",
                            "owner": "admin",
                            "eventType": "event",
                            "privacy": "default",
                            "startTime": `${start.getHours()}:${start.getMinutes()}`,
                            "endTime": `${end.getHours()}:${end.getMinutes()}`,
                            "repeat": false,
                            "repeatOptions": {
                                "times": 1,
                                "every": {"title": "days"},
                                "repeatEnd": "never",
                                "endTimes": 1,
                                "weekDays": {
                                    "su": true,
                                    "mo": true,
                                    "tu": true,
                                    "we": true,
                                    "th": true,
                                    "fr": true,
                                    "sa": true
                                },
                                "monthRepeat": {"title": "", "select": "day"},
                                "exception": [],
                                "endDate": "2019-12-26"
                            },
                            "uniqueSlot": false,
                            "slotDuration": 30,
                            "nPersons": 1,
                            "slots": [],
                            "slotOptions": [{
                                "weekDay": "Monday",
                                "startTime": "",
                                "endTime": "",
                                "selected": true
                            }, {
                                "weekDay": "Tuesday",
                                "startTime": "",
                                "endTime": "",
                                "selected": true
                            }, {
                                "weekDay": "Wednesday",
                                "startTime": "",
                                "endTime": "",
                                "selected": true
                            }, {
                                "weekDay": "Thursday",
                                "startTime": "",
                                "endTime": "",
                                "selected": true
                            }, {
                                "weekDay": "Friday",
                                "startTime": "",
                                "endTime": "",
                                "selected": true
                            }, {
                                "weekDay": "Saturday",
                                "startTime": "",
                                "endTime": "",
                                "selected": true
                            }, {
                                "weekDay": "Sunday",
                                "startTime": "",
                                "endTime": "",
                                "selected": true
                            }],
                            "slotExceptions": [],
                            "location": {
                                "location": {
                                    "type": "Point",
                                    "coordinates": ["", ""]
                                },
                                "favorite": {},
                                "inputSearch": "",
                                "active": {},
                                "initial": false,
                                "edit": true,
                                "visible": []
                            },
                            "shared": [],
                            "guests": [],
                            "guestList": false,
                            "busy": true,
                            "files": [],
                            "calendar": "5dfcd51c41272d00363bac4d",
                            "timezone": {
                                "start": {
                                    "utc": formattedUTC,
                                    "zone": "America/Sao_Paulo",
                                    "title": "-03:00 America/Sao_Paulo"
                                },
                                "end": {
                                    "utc": formattedUTC,
                                    "zone": "America/Sao_Paulo",
                                    "title": "-03:00 America/Sao_Paulo"
                                },
                                "same": true
                            },
                            "startDate": `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
                            "endDate": `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
                            "description": "<p></p>",
                            "startDateTime": "2019-12-26T03:00:00Z",
                            "endDateTime": "2019-12-26T15:00:00Z",
                            "startDateTimeOriginal": "2019-12-26T00:00:00-03:00",
                            "endDateTimeOriginal": "2019-12-26T12:00:00-03:00"
                        })
                    })
                )
            }

            dispatch({
                type: SYNC_CALENDAR,
                error: !res.ok,
                loading: false
            });
        } else {

        }
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
