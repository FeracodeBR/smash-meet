// @flow

import React, {useState, useEffect} from 'react';
import {
    View,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    AppState,
    TouchableWithoutFeedback
} from 'react-native';
import camera from '../../../../images/smash-camera.png';
import {
    setContactsIntegration,
    changeProfile,
    logout,
    enterPersonalRoom,
    syncContacts,
    syncCalendar,
    callFriend,
    addClient,
    toggleStatus
} from '../actions';
import styles from './styles';
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
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import Collapsible from 'react-native-collapsible';
import {getBottomSpace} from "react-native-iphone-x-helper";
import {ColorPalette} from "../../base/styles/components/styles";
import {CHANGE_PROFILE, STORE_CALL_DATA, SYNC_CALENDAR, SYNC_CONTACTS, TOGGLE_STATUS} from "../actionTypes";
import {navigateToScreen} from "../../base/app";
import {getProfileColor} from "../functions";
import { setCalendarIntegration } from "../../calendar-sync/actions.native";
import {appNavigate} from "../../app";

function ProfileScreen({
                           dispatch,
                           _contacts,
                           _contactsAuthorization,
                           _calendar,
                           _calendarAuthorization,
                           _defaultProfile,
                           _profiles,
                           _friends,
                           _groups,
                           _personalRoom,
                           _call,
                           _config,
                           _loading = {},
                           _error,
                           _socket
}) {
    useEffect(() => {
        dispatch(setContactsIntegration());
        dispatch(setCalendarIntegration());

        AppState.addEventListener('change', _handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        }
    }, []);

    useEffect(() => {
        if(_defaultProfile && _socket) dispatch(addClient(_socket.id, _defaultProfile.id));
    }, [_defaultProfile]);

    useEffect(() => {
        if(_socket) {
            _socket.on('/user/friend-status', event => {

            });

            _socket.on('/chat/conference', event => {
                const {roomId, dateTime, sender, receiver} = event.object;
                const friend = _friends.filter(friend => friend.profileRef === sender)[0];

                console.log('event', event);

                switch(event.action) {
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
                                isCaller: false,
                            }
                        });

                        dispatch(navigateToScreen('CallScreen'));
                        break;
                    case 'accept':
                        console.log('log', {
                            socket: _socket.id,
                            action: event.action,
                            _call
                        });

                        dispatch(appNavigate(`${roomId}?jwt=${_call.jwt}`));
                        break;
                    case 'deny':
                        dispatch({
                            type: STORE_CALL_DATA,
                            call: {
                                roomId,
                                friend,
                                status: 'denied',
                                isCaller: true,
                            }
                        });

                        setTimeout(() => {
                            dispatch(navigateToScreen('ProfileScreen'));
                        }, 2000);
                        break;
                    default:
                        break;
                }
            });
        }
    }, [_socket]);

    const [isCollapsed, setCollapsed] = useState(true);
    const [appState, setAppState] = useState(AppState.currentState);

    function _handleAppStateChange(nextAppState) {
        if (
            appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('voltou');
            dispatch(setContactsIntegration());
            dispatch(setCalendarIntegration());

        }
        setAppState(nextAppState);
    }

    function renderItem({ item }) {
        return (
            <View style = { styles.friendItem }>
                <View style = { styles.userInfo }>
                    <HexagononImage friend={ item } />
                    <View style = { styles.profileInfo }>
                        <Text style = { styles.userName }
                              numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text style = { styles.friendName }>
                            {item.fullname || `${item.members} members`}
                        </Text>
                    </View>
                </View>

                {
                    item.profileRef &&
                        <View style = { styles.profileContainer }>
                            {/*<TouchableOpacity>*/}
                            {/*    <Image*/}
                            {/*        resizeMethod = 'resize'*/}
                            {/*        resizeMode = 'contain'*/}
                            {/*        source = { phone }*/}
                            {/*        style = { styles.iconImage } />*/}
                            {/*</TouchableOpacity>*/}
                            <TouchableOpacity onPress={() => {
                                dispatch(callFriend(item))
                            }}>
                                <Image
                                    resizeMethod = 'resize'
                                    resizeMode = 'contain'
                                    source = { camera }
                                    style = { styles.iconImage } />
                            </TouchableOpacity>
                        </View>
                }
            </View>
        );
    }

    if(!_defaultProfile) {
        return (
            <View style = { styles.loadingContainer }>
                <ActivityIndicator color={ColorPalette.white} />
            </View>
        );
    }

    const personalRoomDisabled = !_personalRoom?.name;
    const friendsLength = _friends.length + _groups.length;
    const {userStatus} = _config;

    return (
        <View style = { styles.container }>
            <View style = { styles.header }>
                <TouchableOpacity style = { styles.iconContainer } onPress={() => dispatch(navigateToScreen('WelcomePage'))}>
                    <IconEnterMeet/>
                    <Text style = {styles.descriptionIos}>
                        ENTER MEET
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style = { styles.iconContainer } onPress={() => dispatch(enterPersonalRoom(_personalRoom))} disabled={personalRoomDisabled}>
                    <Text style = { [styles.descriptionIos, {color: personalRoomDisabled ? '#656565' : '#BFBFBF'}] }>
                        MY ROOM
                    </Text>
                    {
                        personalRoomDisabled ?
                            <IconRoomDisabled/> :
                            <IconRoom/>
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
                    friendsLength > 0 ?
                        <FlatList
                            data = { [
                                ..._groups,
                                ..._friends
                            ] }
                            keyExtractor = {item => item.profileRef || item._id}
                            renderItem = { renderItem } /> :
                        <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
                            <Text style={styles.optionsBodyText}>
                                Friends list is empty
                            </Text>
                        </View>
                }
            </View>
            <TouchableWithoutFeedback onPress={() => setCollapsed(!isCollapsed)}>
                <View style = { styles.footer }>
                    <View style = { styles.userInfo }>
                        <HexagononImage friend= { _defaultProfile } />
                        <View style = { styles.profileInfo }>
                            <Text style = { styles.userName }>{_defaultProfile.name}</Text>
                            <Text style = { styles.contactsInfo }>friends {friendsLength}</Text>
                        </View>
                    </View>

                    <View style = { styles.profileContainer }>
                        {
                            _loading[CHANGE_PROFILE] ?
                                <ActivityIndicator color={ColorPalette.white} /> :
                                <View style = { [styles.profile, {backgroundColor: getProfileColor(_defaultProfile.color)}] }>
                                    <Text style = { styles.profileText }>
                                        {_defaultProfile.abbr}
                                    </Text>
                                </View>
                        }
                        <TouchableOpacity onPress={() => setCollapsed(!isCollapsed)} style={styles.menuIconContainer}>
                            {
                                isCollapsed ?
                                    <IconMenuUp style = { styles.icon } /> :
                                    <IconMenuDown style = { styles.icon } />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.collapsible}>
                <Collapsible collapsed={isCollapsed}>
                    <View style={styles.options}>
                        <View style={styles.optionsHeader}>
                            <Text style={styles.optionsHeaderText}>
                                OPTIONS
                            </Text>
                        </View>
                        <View style={styles.optionsBody}>
                            <TouchableOpacity
                                style={styles.optionBodyItem}
                                onPress={() => dispatch(toggleStatus(userStatus))}>
                                <View style={[styles.optionBodyHeader, {flex: _calendarAuthorization !== 'denied' ? 3 : 1}]}>
                                    <View style={styles.statusContainer}>
                                        <View style={[styles.statusCircle, {backgroundColor: userStatus === 'online' ? 'lime' : 'grey'}]}/>
                                    </View>
                                    <View style={styles.optionBodyTitle}>
                                        <Text style={styles.optionBodyTitleText}>
                                            Toggle status
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.optionLoading}>
                                    {
                                        _loading[TOGGLE_STATUS] && <ActivityIndicator color="white"/>
                                    }
                                </View>
                            </TouchableOpacity>
                            {
                                Platform.OS === 'ios' && (
                                    <>
                                        <TouchableOpacity
                                            style={styles.optionBodyItem}
                                            onPress={() => {
                                                dispatch(syncCalendar(_calendar))

                                                // dispatch(setCalendarIntegration());
                                                // setTimeout(() => dispatch(syncCalendar(_calendar)), 2000);
                                            }}
                                            disabled={_calendarAuthorization === 'denied'}>
                                            <View style={[styles.optionBodyHeader, {flex: _calendarAuthorization !== 'denied' ? 3 : 1}]}>
                                                {
                                                    _calendarAuthorization !== 'denied' ?
                                                        <IconSyncCalendar />:
                                                        <IconSyncCalendarDisabled />
                                                }
                                                <View style={styles.optionBodyTitle}>
                                                    <Text style={[styles.optionBodyTitleText, {color: _calendarAuthorization !== 'denied' ? '#BFBFBF' : '#656565'}]}>
                                                        Synchronize calendar
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.optionLoading}>
                                                {
                                                    _calendarAuthorization !== 'denied' ?
                                                        _loading[SYNC_CALENDAR] && <ActivityIndicator color="white"/> :
                                                        <Text style={styles.permissionDeniedText}>
                                                            permission denied
                                                        </Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.optionBodyItem}
                                            onPress={() => dispatch(syncContacts(_contacts))}
                                            disabled={!_contactsAuthorization}>
                                            <View style={[styles.optionBodyHeader, {flex: _contactsAuthorization ? 3 : 1}]}>
                                                {
                                                    _contactsAuthorization ?
                                                        <IconSyncContacts /> :
                                                        <IconSyncContactsDisabled />
                                                }
                                                <View style={styles.optionBodyTitle}>
                                                    <Text style={[styles.optionBodyTitleText, {color: _contactsAuthorization ? '#BFBFBF' : '#656565'}]}>
                                                        Synchronize contacts
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.optionLoading}>
                                                {
                                                    _contactsAuthorization ?
                                                        _loading[SYNC_CONTACTS] && <ActivityIndicator color="white"/> :
                                                        <Text style={styles.permissionDeniedText}>
                                                            permission denied
                                                        </Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                )
                            }
                            <TouchableOpacity
                                onPress={() => dispatch(logout())}
                                style={styles.optionBodyItem}>
                                <View style={styles.optionBodyHeader}>
                                    <IconLogout style = { styles.icon }/>
                                    <View style={styles.optionBodyTitle}>
                                        <Text style={styles.optionBodyTitleText}>
                                            Logout
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.options}>
                        <View style={styles.optionsHeader}>
                            <Text style={styles.optionsHeaderText}>
                                PROFILES
                            </Text>
                        </View>
                        <View style={styles.optionsBody}>
                            {
                                _profiles.length > 0 ?
                                    <FlatList
                                        style={styles.profileList}
                                        data = { _profiles.filter(profile => !profile.default) }
                                        keyExtractor = {item => item.id}
                                        ListFooterComponent={<View style={{height: getBottomSpace()}} />}
                                        renderItem = {({item, index}) => (
                                            <TouchableOpacity
                                                style={styles.collapsed}
                                                onPress={() => dispatch(changeProfile(item))}>
                                                <View style={styles.userInfo}>
                                                    <HexagononImage friend={item}/>
                                                    <View style={styles.profileInfo}>
                                                        <Text style={styles.userName}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={styles.profileContainer}>
                                                    <View style={[styles.profile, {marginRight: 35}, {backgroundColor: getProfileColor(item.color)}]}>
                                                        <Text style={styles.profileText}>
                                                            {item.abbr}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )} />
                                        :
                                    <View style={{paddingBottom: getBottomSpace()}}>
                                        <Text style={styles.optionsBodyText}>
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
        _loading: state['features/contacts-sync'].loading,
        _error: state['features/contacts-sync'].error,
        _socket: state['features/welcome'].socket,
    };
}


export default translate(connect(_mapStateToProps)(ProfileScreen));
