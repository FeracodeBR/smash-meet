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
    KeyboardAvoidingView, TextInput, Dimensions
} from 'react-native';
import meetGroup from '../../../../images/meet-group.png';
import myRoom from '../../../../images/my-room.png';
import camera from '../../../../images/smash-camera.png';
import phone from '../../../../images/smash-phone.png';
import {setContactsIntegration, changeProfile, logout, enterPersonalRoom, syncContacts, syncCalendar, callFriend} from '../actions';
import styles from './styles';
import {
    IconMenuUp,
    IconMenuDown,
    IconSyncContacts,
    IconLogout,
    IconSyncCalendar
} from '../../base/icons/svg';
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import Collapsible from 'react-native-collapsible';
import {getBottomSpace} from "react-native-iphone-x-helper";
import {ColorPalette} from "../../base/styles/components/styles";
import {appNavigate} from "../../app";
import {CHANGE_PROFILE, SYNC_CALENDAR, SYNC_CONTACTS} from "../actionTypes";
import {PLACEHOLDER_TEXT_COLOR} from "../../welcome/components/styles";
import {navigateToScreen} from "../../base/app";
import {getProfileColor} from "../functions";
import AsyncStorage from '@react-native-community/async-storage';
// import Modal from "react-native-modal";
import io from 'socket.io-client';
import { setCalendarIntegration } from "../../calendar-sync";

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
                           _loading = {},
                           _error
}) {
    // let ws;

    // const ws =io('35.209.31.83:3000', { forceNew: true, secure: false, rejectUnauthorized: false })
    // const ws =io('104.26.13.201/socket.io', { forceNew: true, secure: true, rejectUnauthorized: false })
    // const socket = io('wss://websocket-server.smashinnovations.com', {
    //     path: 'socket.io'
    // });
    //
    //
    // ws.on('connect', () => {
    //
    //     console.log('conectooo');
    // });
    //
    // ws.on('connect_error', (err) => {
    //     console.log('err', err);
    //
    // });

    // ws.onopen = e => {
    //     console.log('abriu');
    //     console.log('e', e);
    // };
    //
    // ws.onmessage = e => {
    //     console.log('e', e);
    // };
    //
    // ws.onerror = (e) => {
    //     // an error occurred
    //     console.log('err: ', e.message);
    // };
    //
    // ws.onclose = (e) => {
    //     // connection closed
    //     console.log(e.code, e.reason);
    // };

        // const ws = new WebSocket('wss://104.26.13.201');
    //     ws = new WebSocket('wss://104.26.13.201/socket.io');
    //     ws = new WebSocket('wss://websocket-server.smashinnovations.com');

    //     const ws = new WebSocket('wss://echo.websocket.org');
    //
    //     ws.onopen = e => {
    //         console.log('open');
    //         console.log('e', e);
    //     };
    //
    //     ws.onmessage = e => {
    //         console.log('message', e);
    //     };
    //
    //     ws.onerror = (e) => {
    //         // an error occurred
    //         console.log('err: ', e.message);
    //     };
    //
    //     ws.onclose = (e) => {
    //         // connection closed
    //         console.log('close: ', e);
    //         console.log(e.code, e.reason);
    //     };

    useEffect(() => {
        dispatch(setContactsIntegration());
        dispatch(setCalendarIntegration());
    }, []);

    const [isCollapsed, setCollapsed] = useState(true);
    // const [isCallModalVisible, setCallModalVisible] = useState(false);

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
                            {item.fullname}
                        </Text>
                    </View>
                </View>

                <View style = { styles.profileContainer }>
                    <TouchableOpacity>
                        <Image
                            resizeMethod = 'resize'
                            resizeMode = 'contain'
                            source = { phone }
                            style = { styles.iconImage } />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => dispatch(callFriend(item.profileRef))}>
                        <Image
                            resizeMethod = 'resize'
                            resizeMode = 'contain'
                            source = { camera }
                            style = { styles.iconImage } />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style = { styles.container }>
            <View style = { styles.header }>
                <TouchableOpacity style = { styles.iconContainer } onPress={() => dispatch(navigateToScreen('WelcomePage'))}>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { meetGroup } />
                    <Text style = { styles.descriptionIos }>
                        ENTER MEET
                    </Text>
                </TouchableOpacity>

                {/*<Image*/}
                {/*    resizeMethod = 'resize'*/}
                {/*    resizeMode = 'contain'*/}
                {/*    source = { logo }*/}
                {/*    style = { styles.logo } />*/}
                <TouchableOpacity style = { styles.iconContainer } onPress={() => dispatch(enterPersonalRoom())}>
                    <Text style = { styles.descriptionIos }>
                        MY ROOM
                    </Text>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { myRoom } />
                </TouchableOpacity>
            </View>
            <View style = { styles.content }>
                <View style = { styles.subheader } >
                    <Text style = { styles.descriptionIos }>
                        FRIENDS
                    </Text>
                </View>
                <FlatList
                    data = { [
                        ..._groups,
                        ..._friends
                    ] }
                    keyExtractor = {item => item.profileRef || item._id}
                    renderItem = { renderItem } />
            </View>

            {/*{renderCallModal()}*/}

            <View style = { styles.footer }>
                <View style = { styles.userInfo }>
                    <HexagononImage
                        size = { 42 }
                        friend= { _defaultProfile } />
                    <View style = { styles.profileInfo }>
                        <Text style = { styles.userName }>{_defaultProfile.name}</Text>
                        <Text style = { styles.contactsInfo }>friends {_friends.length + _groups.length}</Text>
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
                                            onPress={() => dispatch(syncCalendar(_calendar))}>
                                            <View style={styles.optionBodyHeader}>
                                                <IconSyncCalendar style = { styles.icon }/>
                                                <View style={styles.optionBodyTitle}>
                                                    <Text style={styles.optionBodyTitleText}>
                                                        Synchronize calendar
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.optionLoading}>
                                                {
                                                    _loading[SYNC_CALENDAR] && <ActivityIndicator color="white"/>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.optionBodyItem}
                                            onPress={() => dispatch(syncContacts(_contacts))}>
                                            <View style={styles.optionBodyHeader}>
                                                <IconSyncContacts style = { styles.icon }/>
                                                <View style={styles.optionBodyTitle}>
                                                    <Text style={styles.optionBodyTitleText}>
                                                        Synchronize contacts
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.optionLoading}>
                                                {
                                                    _loading[SYNC_CONTACTS] && <ActivityIndicator color="white"/>
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
                                _profiles.length > 1 ?
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
                                    <Text style={styles.optionsBodyText}>
                                        No other profiles available
                                    </Text>
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
        _loading: state['features/contacts-sync'].loading,
        _error: state['features/contacts-sync'].error,
    };
}


export default translate(connect(_mapStateToProps)(ProfileScreen));
