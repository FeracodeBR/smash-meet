// @flow

import React, {useState, useEffect} from 'react';
import {View, Image, Text, FlatList, TouchableOpacity, Platform, Dimensions, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../../../images/smash-meet-logo.png';
import meetGroup from '../../../../images/meet-group.png';
import myRoom from '../../../../images/my-room.png';
import camera from '../../../../images/smash-camera.png';
import phone from '../../../../images/smash-phone.png';
import { setContactsIntegration, changeProfile , logout, enterPersonalRoom} from '../actions';
import styles from './styles';
import {
    IconMenuUp,
    IconMenuDown
} from '../../base/icons/svg';
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import Collapsible from 'react-native-collapsible';
import {getBottomSpace} from "react-native-iphone-x-helper";
import {ColorPalette} from "../../base/styles/components/styles";
import {appNavigate} from "../../app";

function ProfileScreen({ dispatch, _contacts, _defaultProfile, _profiles, _friends, _groups, _loading, _error}) {
    useEffect(() => {
        dispatch(setContactsIntegration());
    }, []);

    const [isCollapsed, setCollapsed] = useState(true);

    function renderItem({ item }) {
        return (
            <View style = { styles.friendItem }>
                <View style = { styles.userInfo }>
                    <HexagononImage
                        size = { 42 }
                        friend={ item } />
                    <View style = { styles.profileInfo }>
                        <Text style = { styles.userName }>{item.name}</Text>
                        <Text style = { styles.friendName }>{item.fullname}</Text>
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
                    <TouchableOpacity>
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

    function keyExtractor(item) {
        return item._id;
    }

    return (
        <View
            style = { styles.container }>
            <LinearGradient
                colors = { [ '#434850', '#292C31' ] }
                locations = { [ 0, 1 ] }
                style = { styles.header }>
                <TouchableOpacity style = { styles.iconContainer }>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { meetGroup } />
                    <Text style = { styles.descriptionIos }>
                        ENTER MEET
                    </Text>
                </TouchableOpacity>

                <Image
                    resizeMethod = 'resize'
                    resizeMode = 'contain'
                    source = { logo }
                    style = { styles.logo } />
                <TouchableOpacity style = { styles.iconContainer } onPress={() => dispatch(enterPersonalRoom())}>
                    <Text style = { styles.descriptionIos }>
                        MY ROOM
                    </Text>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { myRoom } />
                </TouchableOpacity>
            </LinearGradient>
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
                    keyExtractor = { keyExtractor }
                    renderItem = { renderItem } />
            </View>
            <View style = { styles.footer }>
                <View style = { styles.userInfo }>
                    <HexagononImage
                        size = { 42 }
                        friend= { _defaultProfile } />
                    <View style = { styles.profileInfo }>
                        <Text style = { styles.userName }>{_defaultProfile.name}</Text>
                        <Text style = { styles.contactsInfo }>contacts {_friends.length + _groups.length}</Text>
                    </View>
                </View>

                <View style = { styles.profileContainer }>
                    {
                        _loading ?
                            <ActivityIndicator color={ColorPalette.white} /> :
                            <View style = { styles.profile }>
                                <Text style = { styles.profileText }>
                                    {_defaultProfile.abbr}
                                </Text>
                            </View>
                    }
                    {
                        _profiles.length > 2 &&
                            <TouchableOpacity onPress={() => setCollapsed(!isCollapsed)} style={styles.menuIconContainer}>
                                {
                                    isCollapsed ?
                                        <IconMenuUp style = { styles.icon } /> :
                                        <IconMenuDown style = { styles.icon } />
                                }
                            </TouchableOpacity>
                    }
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
                            <TouchableOpacity>
                                <Text style={styles.optionsBodyText}>
                                    Synchronize calendar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.optionsBodyText}>
                                    Synchronize contacts
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => dispatch(logout())}>
                                <Text style={styles.optionsBodyText}>
                                    Logout
                                </Text>
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
                            <FlatList
                                style={styles.profileList}
                                data = { _profiles.filter(profile => !profile.default) }
                                keyExtractor = { item => item.id }
                                ListFooterComponent={<View style={{height: getBottomSpace()}} />}
                                renderItem = {({item, index}) => (
                                    <TouchableOpacity
                                        style={[styles.collapsed, {paddingBottom: (false && Platform.OS === 'ios') ? getBottomSpace() : 8}]}
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
                                            <View style={[styles.profile, {marginRight: 35}]}>
                                                <Text style={styles.profileText}>
                                                    {item.abbr}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )} />
                        </View>
                    </View>
                </Collapsible>
            </View>
        </View>
    );
}

function _mapStateToProps(state: Object) {
    const { authorization, contacts } = state['features/contacts-sync'];

    console.log('contactsync', state['features/contacts-sync']);
    console.log('contacts', contacts);

    return {
        _authorization: authorization,
        _eventList: state['features/calendar-sync'].events,
        _contacts: contacts,
        _defaultProfile: state['features/contacts-sync'].defaultProfile,
        _profiles: state['features/contacts-sync'].profiles,
        _friends: state['features/contacts-sync'].friends,
        _groups: state['features/contacts-sync'].groups,
        _loading: state['features/contacts-sync'].loading,
        _error: state['features/contacts-sync'].error,
    };
}


export default translate(connect(_mapStateToProps)(ProfileScreen));
