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
import phone from '../../../../images/smash-phone.png';
import {setContactsIntegration, changeProfile, logout, enterPersonalRoom, syncContacts, syncCalendar, callFriend} from '../actions';
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
    IconEnterMeetDisabled
} from '../../base/icons/svg';
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import Collapsible from 'react-native-collapsible';
import {getBottomSpace} from "react-native-iphone-x-helper";
import {ColorPalette} from "../../base/styles/components/styles";
import {CHANGE_PROFILE, SYNC_CALENDAR, SYNC_CONTACTS} from "../actionTypes";
import {navigateToScreen} from "../../base/app";
import {getProfileColor} from "../functions";
import { setCalendarIntegration } from "../../calendar-sync/actions.native";
// import Modal from "react-native-modal";

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
                           _loading = {},
                           _error
}) {
    useEffect(() => {
        dispatch(setContactsIntegration());
        dispatch(setCalendarIntegration());
        AppState.addEventListener('change', _handleAppStateChange);

        const ws = new WebSocket(`wss://websocket-server.smashinnovations.com/socket.io/?location=%7B%22latitude%22%3A-27.59667%2C%22longitude%22%3A-48.54917%2C%22countryCode%22%3A%22BR%22%2C%22id%22%3A%228edfcb8025acdfe98f46%22%7D&token=YzljMDM5MGM4YzkzMDNjMDMwODk1MDllYmUzZjBiNTAkNURaS0RIYXZBek5UeXAxa0JySWk1UGV6Wm1yRnRUcm9yT25FbHQ1RWtBNkFwWGFEeTRHS3JqQjFnVS92ekNaUThxVEVzbVlKQWNrblozTW5jYWJVcjRPbXp5UW9SY3FDRzhQeUZPMHY4ZWpVYURsOUdodnJWTVRIRnF0RHVCek8wMjBoclJYM0t6aEFDd1plQnFaWVd5OUJHVG1LMng1b0czNFZzektuQ0hxOUZzTjE1RHZlQkFUNVhXSXZNcDRaSzBaZkh2alhUK3NCbThTcDZxYkszMWlQZ3lLNXg0d3J4Tm0yOEZONm1BRUxNYXpxemNaZVRiRFdkbGtvT3NMdGpaTCtleDdnNWFpTDRiQzZNL1BSUUp4NXZrRThxcmUzd2QydVhKbE1WL1JXS0tIZUNXS05OM1I1VDdxOVRDbnN4MGVGQzZzOCtmL0V2L1VTVlFrMjEzN1pYOHZpaDVVdjBpQkZ6WGw2SUZlejNmdWlLWE1BcU1qdGNKbzdUYmtrVjk5Y3FYTzlvQTVodzZFZm5veStmWHFodWkzTklhcDFOVmJSRVpubWQ5Ujg1b3g1aE9FTlYwMDZybW9hVjROZTNNSXZpdnA0Rng2SUYvVzBxeDhLZllqTTJaeVZtSHRDbUJMTnF6Z3ExUDlZblpqWVpYa0NibjV6emw3M0pjNkRONGlWMWI5dVpoYTM0dGpRbndkTVBGUjVYbno4TFV0dzcwdFFJWE05Y3FwblN0R3VlZ09KQkRmNk5xZzNZZ2tVS1BGMVdXbE84KzVoR2RpZ3drZndKYWlPVDJROXN1QjVRVWtOUzhOWU1ISTBOdGcvVzRKN3JlZVRlOHhUQVR5QnBPRnlSQ2xtMTJGVjRaU2o0cUkrSkd2UjFjMlJtYnNyVElWRWZ3cXBETUc4azRtL2tidkhpMnpoZk1VWGN2aUxZYm5KM25VZXN5ZFpNQ2ZMb2RlZUFwLzN2R0MxQVBWZDJ5a2VyTmRIaWhRaVJFZlhXbng2aktYMzRXN3UwanQ0MHFkaEZzU0pwbklRMTY2Yy9SU29TUmhaMHp3bC80Z0NNK0Q4QWhib3plWlZnY0wzTnVUT0IwZlFMMVhyV3NLanRZSndrYjZsYkVBcEsvSkZCbWJqV2x6dG90a3BCaHpucjdROGFXSm5reDB6dVRzSHdlY3lwbC9oMHVnVFdzNXZGcGFoYXhOTHFGMTRKdFZMWFRtT1V0K3V5RzdsdFpiK01OTmFVdkdCdVFuaEg2WVdwRTVoaXBNZ0JLNk5INDZQa0J2NlFteXJQV042dzlPazZ4ZWcvNWI0RExhdEVzSUhrWjc2MDM4Tk5QM1djSDFCN1BlWFpvMXoyTk5uaFJ1eGZhRnJ1VWZranF1T1V4NDh1bmVkbXc9PQ%3D%3D&EIO=3&transport=websocket&sid=28N_CZhrgqUS5A1iACSD`);

        ws.onopen = () => {

            console.log('open');

            // connection opened
            // ws.send('something'); // send a message
        };

        ws.onmessage = (e) => {
            console.log('message');

            // a message was received
            // console.log(e.data);
        };

        ws.onerror = (e) => {
            console.log('error');

            // an error occurred
            console.log(e.message);
        };

        ws.onclose = (e) => {
            // connection closed
            console.log('close', e.code, e.reason);
        };

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        }
    }, []);

    const [isCollapsed, setCollapsed] = useState(true);
    const [appState, setAppState] = useState(AppState.currentState);
    // const [isCallModalVisible, setCallModalVisible] = useState(false);

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

    // function renderCallModal() {
    //     return (
    //         <Modal isVisible={isCallModalVisible}
    //                onBackdropPress={() => setVisible(false)}
    //                onSwipeComplete={() => setVisible(false)}
    //                swipeDirection="up">
    //             <KeyboardAvoidingView
    //                 behavior = 'padding'
    //                 style = { styles.modal }>
    //                 <TextInput
    //                     autoCapitalize = 'none'
    //                     autoComplete = 'off'
    //                     autoCorrect = { false }
    //                     autoFocus = { true }
    //                     onChangeText = { setRoom }
    //                     placeholder = { 'Enter link or room name' }
    //                     placeholderTextColor = {PLACEHOLDER_TEXT_COLOR}
    //                     returnKeyType = { 'go' }
    //                     style = { styles.textInput }
    //                     underlineColorAndroid = 'transparent'
    //                     value = { room } />
    //                 <View style = { styles.gradientContainer }>
    //                     <TouchableOpacity
    //                         style = { styles.gradientButton }>
    //                         <Text style = { styles.gradientButtonText }>
    //                             JOIN MEETING
    //                         </Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             </KeyboardAvoidingView>
    //         </Modal>
    //     )
    // }

    function renderItem({ item }) {
        return (
            <View style = { styles.friendItem }>
                <View style = { styles.userInfo }>
                    <HexagononImage
                        size = { 42 }
                        friend={ item } />
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
                            <TouchableOpacity onPress={() => dispatch(callFriend(item.profileRef))}>
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

    return (
        <View style = { styles.container }>
            <View style = { styles.header }>
                <TouchableOpacity style = { styles.iconContainer } onPress={() => dispatch(navigateToScreen('WelcomePage'))}>
                    <IconEnterMeet/>
                    <Text style = {styles.descriptionIos}>
                        ENTER MEET
                    </Text>
                </TouchableOpacity>

                {/*<Image*/}
                {/*    resizeMethod = 'resize'*/}
                {/*    resizeMode = 'contain'*/}
                {/*    source = { logo }*/}
                {/*    style = { styles.logo } />*/}
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

            {/*{renderCallModal()}*/}

            <TouchableWithoutFeedback onPress={() => setCollapsed(!isCollapsed)}>
                <View style = { styles.footer }>
                    <View style = { styles.userInfo }>
                        <HexagononImage
                            size = { 42 }
                            friend= { _defaultProfile } />
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
                                                    <HexagononImage
                                                        size={42}
                                                        friend={item}/>
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
    console.log('CONTACTS', state['features/contacts-sync']);
    console.log('CALENDAR', state['features/calendar-sync']);

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
        _loading: state['features/contacts-sync'].loading,
        _error: state['features/contacts-sync'].error,
    };
}


export default translate(connect(_mapStateToProps)(ProfileScreen));
