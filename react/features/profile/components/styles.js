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
        flex: 1,
        // paddingHorizontal: 10
    },
    subheader: {
        paddingTop: 12,
        paddingBottom: 2,
        paddingHorizontal: 15,
        borderColor: '#40444B',
        borderBottomWidth: 2
    },
    collapsible: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorPalette.black,
        // backgroundColor: ColorPalette.red,
        // maxHeight: 500,
    },
    collapsed: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal: 15,
        paddingVertical: 15,
        width: Dimensions.get('window').width,
    },
    footer: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: Platform.OS === 'ios' ? getBottomSpace() : 8,
        backgroundColor: ColorPalette.black,
        width: Dimensions.get('window').width,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        paddingVertical: 2,
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
    menuIconContainer: {
        marginLeft: 5
    },
    icon: {
        color: '#656565',
        fontSize: 12
    },
    iconImage: {
        marginHorizontal: 12
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: Dimensions.get('window').width,
        borderColor: '#40444B',
        borderBottomWidth: 2
    },
    friendName: {
        color: '#BFBFBF',
        fontSize: 11,
        fontWeight: '300',
        fontStyle: 'italic'
    },
    options: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    optionsHeader: {
        width: '100%',
        borderColor: '#40444B',
        borderBottomWidth: 2,
        paddingBottom: 5,
    },
    optionsBody: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    optionsHeaderText: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white'
    },
    optionsBodyText: {
        fontWeight: '500',
        fontSize: 15,
        color: 'white',
        paddingVertical: 5,
    },
    profileList: {
        maxHeight: Dimensions.get('window').height / 2
    }
};
