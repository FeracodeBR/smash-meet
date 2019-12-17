// @flow

import { Dimensions, Platform } from 'react-native';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { ColorPalette } from '../../base/styles/components/styles';

export default {
    container: {
        flex: 1,
        backgroundColor: ColorPalette.screen
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0
    },
    logo: {
        height: 33.86,
        width: 30.47,
        marginVertical: 14
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    descriptionIos: {
        marginHorizontal: 7,
        fontSize: 12,
        color: '#BFBFBF',
        letterSpacing: 0.5,
        fontVariant: [ 'small-caps' ],
        textTransform: Platform.OS === 'ios' ? 'lowercase' : 'uppercase'
    },
    descriptionAndroid: {
        marginHorizontal: 7,
        fontSize: 12,
        color: '#BFBFBF',
        fontFamily: 'Roboto',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    content: {
        flex: 1
    },
    subheader: {
        paddingTop: 12,
        paddingBottom: 2,
        paddingHorizontal: 15,
        borderColor: '#40444B',
        borderBottomWidth: 2
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        position: 'absolute',
        bottom: 0,
        backgroundColor: ColorPalette.black,
        opacity: 0.9,
        width: Dimensions.get('window').width,
        paddingBottom: Platform.OS === 'ios' ? getBottomSpace() : 8,
        paddingTop: 15
    },
    avatar: {
        height: 42,
        width: 42
    },
    userName: {
        color: '#BFBFBF',
        fontSize: 15,
        fontWeight: '500'
    },
    contactsInfo: {
        color: '#BFBFBF',
        fontSize: 11,
        fontWeight: '300',
        fontVariant: [ 'small-caps' ],
        textTransform: Platform.OS === 'ios' ? 'lowercase' : 'uppercase'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileInfo: {
        marginLeft: 12
    },
    profile: {
        color: ColorPalette.white,
        textTransform: 'uppercase',
        fontSize: 12,
        backgroundColor: '#5A7BEF',
        borderRadius: 100,
        paddingHorizontal: 6,
        paddingVertical: 2
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileText: {
        color: ColorPalette.white,
        textTransform: 'uppercase',
        fontSize: 12,
        fontWeight: 'bold'
    },
    icon: {
        color: '#656565',
        fontSize: 12,
        marginLeft: 2
    },
    iconImage: {
        marginHorizontal: 12
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        width: Dimensions.get('window').width,
        borderColor: '#40444B',
        borderBottomWidth: 2
    },
    friendName: {
        color: '#BFBFBF',
        fontSize: 11,
        fontWeight: '300',
        fontStyle: 'italic'
    }
};
