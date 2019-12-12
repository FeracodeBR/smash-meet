import React from 'react';
import { View, Image, Text, FlatList } from 'react-native';
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

export function ProfileScreen() {
    function renderItem({ item }) {
        return (
            <View style = { styles.friendItem }>
                <View style = { styles.userInfo }>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = {{ uri: item.picture }}
                        style = { styles.avatar } />
                    <View style = { styles.profileInfo }>
                        <Text style = { styles.userName }>{item.fullname}</Text>
                        <Text style = { styles.friendName }>{item.name}</Text>
                    </View>
                </View>

                <View style = { styles.profileContainer }>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { phone }
                        style = { styles.iconImage } />
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { camera }
                        style = { styles.iconImage } />
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
                <View style = { styles.iconContainer }>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { meetGroup } />
                    <Text style = { styles.descriptionIos }>
                            ENTER MEET
                    </Text>
                </View>
                <Image
                    resizeMethod = 'resize'
                    resizeMode = 'contain'
                    source = { logo }
                    style = { styles.logo } />
                <View style = { styles.iconContainer }>
                    <Text style = { styles.descriptionIos }>
                        MY ROOM
                    </Text>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { myRoom } />
                </View>
            </LinearGradient>
            <View style = { styles.content }>
                <View style = { styles.subheader } >
                    <Text style = { styles.descriptionIos }>
                        FRIENDS
                    </Text>
                </View>
                <FlatList
                    data = { friends }
                    keyExtractor = { keyExtractor }
                    renderItem = { renderItem } />
            </View>
            <View style = { styles.footer }>
                <View style = { styles.userInfo }>
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'contain'
                        source = { meetGroup }
                        style = { styles.avatar } />
                    <View style = { styles.profileInfo }>
                        <Text style = { styles.userName }>Lucas Baumgart Costa</Text>
                        <Text style = { styles.contactsInfo }>contacts 96</Text>
                    </View>
                </View>

                <View style = { styles.profileContainer }>
                    <View style = { styles.profile }>
                        <Text style = { styles.profileText }>LBC</Text>
                    </View>
                    <IconMenuUp
                        style = { styles.icon } />
                </View>
            </View>
        </View>
    );
}
