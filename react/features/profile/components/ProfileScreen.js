// @flow

import React from 'react';
import { View, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../../../images/smash-meet-logo.png';
import meetGroup from '../../../../images/meet-group.png';
import myRoom from '../../../../images/my-room.png';
import camera from '../../../../images/smash-camera.png';
import phone from '../../../../images/smash-phone.png';
import styles from './styles';
import {
    IconMenuUp
} from '../../base/icons/svg';
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';

const friends = [ {
    archived: false,
    email: 'thiagoSTG10@thiagoSTG10.com',
    fullname: 'thiagoSTG10',
    name: 'thiagoSTG10',
    picture: 'https://storage.googleapis.com/app.newusedmedia.com/78ff97726b2da9512832.jpg',
    profileRef: '5df0f6e0acbaf2003613765a',
    status: 'offline',
    _id: '5df0f6e0acbaf2003613765b'
}, {
    archived: false,
    email: 'thiagoSTG10@thiagoSTG10.com',
    fullname: 'thiagoSTG10',
    name: 'thiagoSTG10',
    picture: 'https://storage.googleapis.com/app.newusedmedia.com/78ff97726b2da9512832.jpg',
    profileRef: '5df0f6e0acbaf2003613765a',
    status: 'offline',
    _id: '5df0f6e0acbaf2003613765b2'
} ];

function ProfileScreen({ _contacts, dispatch }) {
    function renderItem({ item }) {
        return (
            <View style = { styles.friendItem }>
                <View style = { styles.userInfo }>
                    <HexagononImage
                        size = { 42 }
                        uri = { item.picture } />
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
        return item.recordID;
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
                <TouchableOpacity style = { styles.iconContainer }>
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
                        CONTACTS
                    </Text>
                </View>
                <FlatList
                    bounces = { false }
                    data = { _contacts }
                    keyExtractor = { keyExtractor }
                    renderItem = { renderItem } />
            </View>
            <View style = { styles.footer }>
                <View style = { styles.userInfo }>
                    <HexagononImage
                        size = { 42 }
                        uri = { friends[0].picture } />
                    <View style = { styles.profileInfo }>
                        <Text style = { styles.userName }>Lucas Baumgart Costa</Text>
                        <Text style = { styles.contactsInfo }>contacts 96</Text>
                    </View>
                </View>

                <View style = { styles.profileContainer }>
                    <View style = { styles.profile }>
                        <Text style = { styles.profileText }>LBC</Text>
                    </View>
                    <TouchableOpacity>
                        <IconMenuUp
                            style = { styles.icon } />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function _mapStateToProps(state: Object) {
    const { authorization } = state['features/calendar-sync'];
    const { contacts } = state['features/contacts-sync'];

    return {
        _authorization: authorization,
        _eventList: state['features/calendar-sync'].events,
        _contacts: contacts
    };
}


export default translate(connect(_mapStateToProps)(ProfileScreen));
