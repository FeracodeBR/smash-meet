// @flow

import React, { useState, useEffect } from 'react';
import camera from '../../../../images/smash-camera.png';
import cameraDisabled from '../../../../images/smash-camera-disabled.png';
import styles from './styles';
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import Collapsible from 'react-native-collapsible';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { ColorPalette } from '../../base/styles/components/styles';
import { navigateToScreen } from '../../base/app';
import { getProfileColor } from '../functions';
import { appNavigate } from '../../app';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    TouchableWithoutFeedback,
    RefreshControl,
    Switch
} from 'react-native';
import {
    changeProfile,
    logout,
    enterPersonalRoom,
    callFriend,
    addClient,
    toggleStatus,
    refresh,
} from '../actions';
import {
    IconMenuUp,
    IconMenuDown,
    IconSyncContacts,
    IconSyncContactsDisabled,
    IconLogout,
    IconSyncCalendar,
    IconSyncCalendarDisabled,
    IconRoom,
    IconRoomDisabled,
    IconEnterMeet,
} from '../../base/icons/svg';
import {
    CHANGE_PROFILE,
    STORE_CALL_DATA,
    TOGGLE_STATUS,
    UPDATE_FRIENDS_STATUS
} from '../actionTypes';
import {
    FETCH_SESSION,
    RELOAD_SESSION,
    SIGN_IN
} from "../../welcome/actionTypes";
import {stopSound} from "../../base/sounds";
import {WAITING_SOUND_ID} from "../../recording";
import WebSocket from '../../websocket/WebSocket';

function ProfileScreen({
    dispatch,
    _contacts,
    _contactsAuthorization,
    _calendar,
    _calendarAuthorization,
    _defaultProfile,
    _profiles = [],
    _friends = [],
    _groups = [],
    _personalRoom,
    _call,
    _config = {},
    _loading = {},
    _wsConnected,
    _error,
}) {
    const personalRoomDisabled = !_personalRoom?.name;
    const friendsLength = _friends.length + _groups.length;
    const { userStatus } = _config;

    const [ isCollapsed, setCollapsed ] = useState(true);
    const [ refreshing, setRefreshing] = useState(false);
    const [ userStatusSwitch, setUserStatusSwitch] = useState(false);
    const [ calendarAutoSync, setCalendarAutoSync] = useState(false);
    const [ contactsAutoSync, setContactsAutoSync] = useState(false);

    useEffect(() => {
        AsyncStorage.multiGet([ 'calendarAutoSync', 'contactsAutoSync' ])
            .then(([[, calendarAutoSyncEnabled], [, contactsAutoSyncEnabled]]) => {
                calendarAutoSyncEnabled && setCalendarAutoSync(true);
                contactsAutoSyncEnabled && setContactsAutoSync(true);
            });
    }, []);

    useEffect(() => {
        if(_wsConnected) {
            WebSocket.addListener('/user/friend-status', handleFriendStatusEvents);
            WebSocket.addListener('/chat/conference', handleConferenceEvents);
        }
    }, [_wsConnected]);

    useEffect(() => {
        if (_defaultProfile && WebSocket.io) {
            dispatch(addClient(WebSocket.io.id, _defaultProfile.id));
            setUserStatusSwitch(userStatus === 'online');
        }
    }, [ _defaultProfile ]);

    useEffect(() => {
        if(!_loading[RELOAD_SESSION]) {
            setUserStatusSwitch(userStatus === 'online');
        }
    }, [_loading[RELOAD_SESSION]]);

    useEffect(() => {
        if(!_loading[FETCH_SESSION]) {
            setRefreshing(false);
        }
    }, [_loading[FETCH_SESSION]]);

    function handleFriendStatusEvents(event) {
        const { profileRef, status } = event;

        console.log('event', event);

        dispatch({
            type: UPDATE_FRIENDS_STATUS,
            profileRef,
            status
        });
    }

    function handleConferenceEvents(event) {
        const { roomId, dateTime, sender, receiver } = event.object;
        const friend = _friends.filter(friend => friend.profileRef === sender)[0];

        console.log('event', event);

        switch (event.action) {
        case 'invite':
            dispatch({
                type: STORE_CALL_DATA,
                call: {
                    roomId,
                    dateTime,
                    sender,
                    receiver,
                    friend,
                    status: 'calling...',
                    isCaller: false
                }
            });

            dispatch(navigateToScreen('CallScreen'));
            break;
        case 'accept':
            dispatch(navigateToScreen('ProfileScreen'));
            dispatch(appNavigate(`${roomId}?jwt=${_call.jwt}`));
            break;
        case 'deny':
            dispatch({
                type: STORE_CALL_DATA,
                call: {
                    roomId,
                    friend,
                    status: 'denied',
                    isCaller: true
                }
            });

            dispatch(stopSound(WAITING_SOUND_ID));

            setTimeout(() => {
                dispatch(navigateToScreen('ProfileScreen'));
            }, 2000);
            break;
        case 'canceled':
            dispatch({
                type: STORE_CALL_DATA,
                call: {
                    roomId,
                    friend,
                    status: 'canceled',
                    isCaller: true
                }
            });

            dispatch(stopSound(WAITING_SOUND_ID));

            setTimeout(() => {
                dispatch(navigateToScreen('ProfileScreen'));
            }, 2000);
            break;
        default:
            break;
        }
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        AsyncStorage.getItem('accessToken').then(accessToken => dispatch(refresh(accessToken)));
    }, [refreshing]);

    function renderItem({ item }) {
        return (
            <View style = { styles.friendItem }>
                <View style = { styles.userInfo }>
                    <HexagononImage
                        friend = { item }
                        showStatus = { true } />
                    <View style = { styles.profileInfo }>
                        <Text
                            style = { styles.userName }
                            numberOfLines = { 1 }>
                            {item.name}
                        </Text>
                        <Text style = { styles.friendName }>
                            {item.fullname || `${item.members} members`}
                        </Text>
                    </View>
                </View>

                {
                    item.profileRef
                        && <View style = { styles.profileContainer }>
                            {/* <TouchableOpacity>*/}
                            {/*    <Image*/}
                            {/*        resizeMethod = 'resize'*/}
                            {/*        resizeMode = 'contain'*/}
                            {/*        source = { phone }*/}
                            {/*        style = { styles.iconImage } />*/}
                            {/* </TouchableOpacity>*/}
                            <TouchableOpacity
                                onPress = { () => dispatch(callFriend(item)) }
                                disabled = { item.status !== 'online' }>
                                <Image
                                    resizeMethod = 'resize'
                                    resizeMode = 'contain'
                                    source = { item.status === 'online' ? camera : cameraDisabled }
                                    style = { styles.iconImage } />
                            </TouchableOpacity>
                        </View>
                }
            </View>
        );
    }

    function handleUserStatusChange(value) {
        setUserStatusSwitch(value);
        dispatch(toggleStatus(userStatus));
    }

    function handleCalendarAutoSyncChange(value) {
        if(_calendarAuthorization) {
            setCalendarAutoSync(value);
            if(value) {
                AsyncStorage.setItem('calendarAutoSync', 'true');
            } else {
                AsyncStorage.removeItem('calendarAutoSync');
            }
        } else {
            //tentar chamar permissao de novo ou guiar
        }
    }

    function handleContactsAutoSyncChange(value) {
        if(_contactsAuthorization) {
            setContactsAutoSync(value);
            if(value) {
                AsyncStorage.setItem('contactsAutoSync', 'true');
            } else {
                AsyncStorage.removeItem('contactsAutoSync');
            }
        } else {
            //tentar chamar permissao de novo ou guiar
        }
    }

    if (!_defaultProfile) {
        return (
            <View style = { styles.loadingContainer }>
                <ActivityIndicator color = { ColorPalette.white } />
            </View>
        );
    }

    return (
        <View style = { styles.container }>
            <View style = { styles.header }>
                <TouchableOpacity
                    style = { styles.iconContainer }
                    onPress = { () => dispatch(navigateToScreen('WelcomePage')) }>
                    <IconEnterMeet />
                    <Text style = { styles.descriptionIos }>
                        ENTER MEET
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = { styles.iconContainer }
                    onPress = { () => dispatch(enterPersonalRoom(_personalRoom)) }
                    disabled = { personalRoomDisabled }>
                    <Text style = { [ styles.descriptionIos, { color: personalRoomDisabled ? '#656565' : '#BFBFBF' } ] }>
                        MY ROOM
                    </Text>
                    {
                        personalRoomDisabled
                            ? <IconRoomDisabled />
                            : <IconRoom />
                    }
                </TouchableOpacity>
            </View>
            <View style = { styles.content }>
                <View style = { styles.subheader } >
                    <Text style = { styles.descriptionIos }>
                        FRIENDS
                    </Text>
                </View>
                {
                    friendsLength > 0
                        ? <FlatList
                            data = { [
                                ..._groups,
                                ..._friends
                            ] }
                            keyExtractor = { item => item.profileRef || item._id }
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor='#BFBFBF'/>}
                            renderItem = { renderItem } />
                        : <View
                            style = {{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 10
                            }}>
                            <Text style = { styles.optionsBodyText }>
                                Friends list is empty
                            </Text>
                        </View>
                }
            </View>
            <TouchableWithoutFeedback onPress = { () => setCollapsed(!isCollapsed) }>
                <View style = { styles.footer }>
                    <View style = { styles.userInfo }>
                        <HexagononImage
                            friend = { _defaultProfile }
                            showStatus = { true } />
                        <View style = { styles.profileInfo }>
                            <Text style = { styles.userName }>{_defaultProfile.name}</Text>
                            <Text style = { styles.contactsInfo }>friends {friendsLength}</Text>
                        </View>
                    </View>

                    <View style = { styles.profileContainer }>
                        {
                            _loading[CHANGE_PROFILE]
                                ? <ActivityIndicator color = { ColorPalette.white } />
                                : <View style = { [ styles.profile, { backgroundColor: getProfileColor(_defaultProfile.color) } ] }>
                                    <Text style = { styles.profileText }>
                                        {_defaultProfile.abbr}
                                    </Text>
                                </View>
                        }
                        <TouchableOpacity
                            onPress = { () => setCollapsed(!isCollapsed) }
                            style = { styles.menuIconContainer }>
                            {
                                isCollapsed
                                    ? <IconMenuUp style = { styles.icon } />
                                    : <IconMenuDown style = { styles.icon } />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <View style = { styles.collapsible }>
                <Collapsible collapsed = { isCollapsed }>
                    <View style = { styles.options }>
                        <View style = { styles.optionsHeader }>
                            <Text style = { styles.optionsHeaderText }>
                                OPTIONS
                            </Text>
                        </View>
                        <View style = { styles.optionsBody }>
                            <View style = { styles.optionBodyItem }>
                                <View style = { styles.optionBodyHeader }>
                                    <View style = { styles.statusContainer }>
                                        <View style = { [ styles.statusCircle, { backgroundColor: userStatus === 'online' ? 'lime' : 'grey' } ] } />
                                    </View>
                                    <View style = { styles.optionBodyTitle }>
                                        <Text style = { styles.optionBodyTitleText }>
                                            Toggle status
                                        </Text>
                                    </View>
                                </View>
                                <View style = { styles.optionLoading }>
                                    <Switch value={userStatusSwitch}
                                            style={styles.switch}
                                            onValueChange={handleUserStatusChange}
                                            disabled={_loading[TOGGLE_STATUS]} />
                                </View>
                            </View>
                            {
                                Platform.OS === 'ios' && (
                                    <>
                                        <View style = { styles.optionBodyItem }
                                              disabled = { !_calendarAuthorization }>
                                            <View style = {[styles.optionBodyHeader, {flex: _calendarAuthorization ? 3 : 1}]}>
                                                {
                                                    _calendarAuthorization
                                                        ? <IconSyncCalendar />
                                                        : <IconSyncCalendarDisabled />
                                                }
                                                <View style = { styles.optionBodyTitle }>
                                                    <Text style = { [ styles.optionBodyTitleText, { color: _calendarAuthorization ? '#BFBFBF' : '#656565' } ] }>
                                                        Auto-sync calendar
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style = { styles.optionLoading }>
                                                {
                                                    _calendarAuthorization
                                                        ? <Switch
                                                            value={calendarAutoSync}
                                                            style={styles.switch}
                                                            onValueChange={handleCalendarAutoSyncChange}
                                                            disabled={!_calendarAuthorization}/>
                                                        : <Text
                                                            style={styles.permissionDeniedText}>
                                                            permission denied
                                                        </Text>
                                                }
                                            </View>
                                        </View>
                                        <View style = { styles.optionBodyItem }
                                              disabled = { !_contactsAuthorization }>
                                            <View style = {[styles.optionBodyHeader, {flex: _calendarAuthorization ? 3 : 1}]}>
                                                {
                                                    _contactsAuthorization
                                                        ? <IconSyncContacts />
                                                        : <IconSyncContactsDisabled />
                                                }
                                                <View style = { styles.optionBodyTitle }>
                                                    <Text style = { [ styles.optionBodyTitleText, { color: _contactsAuthorization ? '#BFBFBF' : '#656565' } ] }>
                                                        Auto-sync contacts
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style = { styles.optionLoading }>
                                                {
                                                    _contactsAuthorization
                                                        ? <Switch
                                                            value={contactsAutoSync}
                                                            style={styles.switch}
                                                            onValueChange={handleContactsAutoSyncChange}
                                                            disabled={!_contactsAuthorization}/>
                                                        : <Text
                                                            style={styles.permissionDeniedText}>
                                                            permission denied
                                                        </Text>
                                                }
                                            </View>
                                        </View>
                                    </>
                                )
                            }
                            <TouchableOpacity
                                onPress = { () => dispatch(logout()) }
                                style = { styles.optionBodyItem }>
                                <View style = { styles.optionBodyHeader }>
                                    <IconLogout style = { styles.icon } />
                                    <View style = { styles.optionBodyTitle }>
                                        <Text style = { styles.optionBodyTitleText }>
                                            Logout
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = { styles.options }>
                        <View style = { styles.optionsHeader }>
                            <Text style = { styles.optionsHeaderText }>
                                PROFILES
                            </Text>
                        </View>
                        <View style = { styles.optionsBody }>
                            {
                                _profiles.length > 0
                                    ? <FlatList
                                        style = { styles.profileList }
                                        data = { _profiles.filter(profile => !profile.default) }
                                        keyExtractor = { item => item.id }
                                        ListFooterComponent = { <View style = {{ height: getBottomSpace() }} /> }
                                        renderItem = { ({ item, index }) => (
                                            <TouchableOpacity
                                                style = { styles.collapsed }
                                                onPress = { () => dispatch(changeProfile(item)) }>
                                                <View style = { styles.userInfo }>
                                                    <HexagononImage friend = { item } />
                                                    <View style = { styles.profileInfo }>
                                                        <Text style = { styles.userName }>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style = { styles.profileContainer }>
                                                    <View style = { [ styles.profile, { marginRight: 35 }, { backgroundColor: getProfileColor(item.color) } ] }>
                                                        <Text style = { styles.profileText }>
                                                            {item.abbr}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ) } />
                                    : <View style = {{ paddingBottom: getBottomSpace() }}>
                                        <Text style = { styles.optionsBodyText }>
                                            No other profiles available
                                        </Text>
                                    </View>
                            }
                        </View>
                    </View>
                </Collapsible>
            </View>
        </View>
    );
}

function _mapStateToProps(state: Object) {
    return {
        _contactsAuthorization: state['features/contacts-sync'].authorization,
        _calendarAuthorization: state['features/calendar-sync'].authorization,
        _calendar: state['features/calendar-sync'].events,
        _contacts: state['features/contacts-sync'].contacts,
        _defaultProfile: state['features/contacts-sync'].defaultProfile,
        _profiles: state['features/contacts-sync'].profiles,
        _friends: state['features/contacts-sync'].friends,
        _groups: state['features/contacts-sync'].groups,
        _personalRoom: state['features/contacts-sync'].personalRoom,
        _call: state['features/contacts-sync'].call,
        _config: state['features/contacts-sync'].config,
        _loading: state['features/base/app'].loading,
        _error: state['features/base/app'].error,
        _wsConnected: state['features/base/app'].wsConnected,
    };
}


export default translate(connect(_mapStateToProps)(ProfileScreen));
