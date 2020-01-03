// @flow

import { Dimensions, Platform } from 'react-native';
import { getBottomSpace, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { ColorPalette } from '../../base/styles/components/styles';

const smallCapsOrUppercase = Platform.OS === 'ios'
    ? {
        fontVariant: [ 'small-caps' ],
        textTransform: 'lowercase'
    }
    : {
        textTransform: 'uppercase'
    };

export default {
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorPalette.screen
    },
    container: {
        flex: 1,
        backgroundColor: ColorPalette.screen
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: getStatusBarHeight(true),
        backgroundColor: ColorPalette.black
    },
    logo: {
        height: 33.86,
        width: 30.47,
        marginVertical: 14
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
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
        backgroundColor: ColorPalette.black
    },
    collapsed: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingBottom: 8,
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
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    profileInfo: {
        flex: 1,
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
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
        fontSize: 12,
    },
    iconImage: {
        marginHorizontal: 12
    },
    friendItem: {
        flex: 1,
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
        width: Dimensions.get('window').width,
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
        paddingVertical: 5,
        color: '#BFBFBF',
    },
    profileList: {
        maxHeight: Dimensions.get('window').height / 2
    },
    modal: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    textInput: {
        backgroundColor: '#4E5054',
        borderRadius: 50,
        color: '#DFDFDF',
        fontSize: 16,
        height: 40,
        padding: 4,
        paddingLeft: 15,
        marginVertical: 10
    },
    gradientContainer: {
        height: 40,
        width: '100%',
        borderRadius: 20,
        backgroundColor: ColorPalette.secondaryLight
    },
    gradientButton: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    gradientButtonText: {
        fontSize: 17,
        color: ColorPalette.white,
        letterSpacing: 0.5,
        ...smallCapsOrUppercase
    },
    optionBodyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width,
        paddingVertical: 5,
    },
    optionBodyHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    optionBodyTitle: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 12,
    },
    optionBodyTitleText: {
        color: '#BFBFBF',
        fontSize: 15,
        fontWeight: '500'
    },
    permissionDeniedText: {
        color: '#656565',
        fontStyle: 'italic',
        fontSize: 12,
        // paddingHorizontal: 10,
    },
    optionLoading: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
};
