// @flow

import { Dimensions, Platform } from 'react-native';

import { BoxModel, ColorPalette } from '../../base/styles';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const PLACEHOLDER_TEXT_COLOR = 'rgba(255, 255, 255, 0.3)';

export const SIDEBAR_AVATAR_SIZE = 100;

const SIDEBAR_HEADER_HEIGHT = 150;

export const SWITCH_THUMB_COLOR = ColorPalette.blueHighlight;

export const SWITCH_UNDER_COLOR = 'rgba(0, 0, 0, 0.4)';

/**
 * The default color of text on the WelcomePage.
 */
const TEXT_COLOR = ColorPalette.white;

const smallCapsOrUppercase = Platform.OS === 'ios'
    ? {
        fontVariant: [ 'small-caps' ],
        textTransform: 'lowercase'
    }
    : {
        textTransform: 'uppercase'
    };


/**
 * The styles of the React {@code Components} of the feature welcome including
 * {@code WelcomePage} and {@code BlankPage}.
 */
export default {

    /**
     * The audio-video switch itself.
     */
    audioVideoSwitch: {
        marginHorizontal: 5
    },

    /**
     * View that contains the audio-video switch and the labels.
     */
    audioVideoSwitchContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    },

    /**
     * Join button style.
     */
    button: {
        backgroundColor: ColorPalette.blue,
        borderColor: ColorPalette.blue,
        borderRadius: 4,
        borderWidth: 1,
        height: 30,
        justifyContent: 'center',
        paddingHorizontal: 20
    },

    /**
     * Renders the button visually disabled.
     */
    buttonDisabled: {
        backgroundColor: '#cccccc',
        borderColor: '#999999'
    },

    /**
     * Join button text style.
     */
    buttonText: {
        alignSelf: 'center',
        color: ColorPalette.white,
        fontSize: 14
    },

    /**
     * The style of the display name label in the side bar.
     */
    displayName: {
        color: ColorPalette.white,
        fontSize: 16,
        marginTop: BoxModel.margin,
        textAlign: 'center'
    },

    /**
     * Container for the button on the hint box.
     */
    hintButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },

    /**
     * Container for the hint box.
     */
    hintContainer: {
        backgroundColor: ColorPalette.white,
        borderColor: ColorPalette.white,
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'column',
        marginVertical: 5,
        overflow: 'hidden',
        paddingHorizontal: BoxModel.padding,
        paddingVertical: 2 * BoxModel.padding
    },

    /**
     * The text of the hint box.
     */
    hintText: {
        textAlign: 'center'
    },

    /**
     * Container for the text on the hint box.
     */
    hintTextContainer: {
        marginBottom: 2 * BoxModel.margin
    },

    /**
     * Container for the items in the side bar.
     */
    itemContainer: {
        flexDirection: 'column',
        paddingTop: 10
    },

    /**
     * A view that contains the field and hint box.
     */
    joinControls: {
        padding: 20
    },

    /**
     * The style of the top-level container/{@code View} of
     * {@code LocalVideoTrackUnderlay}.
     */
    localVideoTrackUnderlay: {
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        flex: 1
    },

    /**
     * Top-level screen style.
     */
    page: {
        flex: 1,
        flexDirection: 'column'
    },

    /**
     * The styles for reduced UI mode.
     */
    reducedUIContainer: {
        alignItems: 'center',
        backgroundColor: ColorPalette.blue,
        flex: 1,
        justifyContent: 'center'
    },

    reducedUIText: {
        color: TEXT_COLOR,
        fontSize: 12
    },

    /**
     * Container for room name input box and 'join' button.
     */
    roomContainer: {
        height: Dimensions.get('window').height,
        backgroundColor: ColorPalette.screen,
        paddingHorizontal: 20,
        alignItems: 'center'
    },

    /**
     * Container of the side bar.
     */
    sideBar: {
        width: 250
    },

    /**
     * The body of the side bar where the items are.
     */
    sideBarBody: {
        backgroundColor: ColorPalette.white,
        flex: 1
    },

    /**
     * The style of the side bar header.
     */
    sideBarHeader: {
        alignItems: 'center',
        flexDirection: 'column',
        height: SIDEBAR_HEADER_HEIGHT,
        justifyContent: 'center',
        padding: BoxModel.padding
    },

    /**
     * Style of the menu items in the side bar.
     */
    sideBarItem: {
        padding: 13
    },

    /**
     * The View inside the side bar buttons (icon + text).
     */
    sideBarItemButtonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },

    /**
     * The icon in the side bar item touchables.
     */
    sideBarItemIcon: {
        color: ColorPalette.blueHighlight,
        fontSize: 20,
        marginRight: 15
    },

    /**
     * The label of the side bar item touchables.
     */
    sideBarItemText: {
        color: ColorPalette.black,
        fontWeight: 'bold'
    },

    /**
     * The container of the label of the audio-video switch.
     */
    switchLabel: {
        paddingHorizontal: 3
    },

    /**
     * Room input style.
     */
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

    /**
     * The style of the top-level container of {@code WelcomePage}.
     */
    welcomePage: {
        backgroundColor: ColorPalette.white,
        overflow: 'hidden'
    },

    /**
     * The style of the header of {@code WelcomePage}.
     */

    header: {
        marginTop: getStatusBarHeight(true) + 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 100,
        height: 100,
        backgroundColor: 'red'
    },
    content: {
        position: 'absolute',
        top: '30%',
        width: '100%'
    },
    body: {
        position: 'absolute',
        top: '35%',
        width: '100%'
    },
    footer: {
        position: 'absolute',
        bottom: '10%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row'
    },
    column: {
        height: 60
    },
    title: {
        fontWeight: '300',
        fontSize: 30,
        color: ColorPalette.white
    },
    subtitleIos: {
        fontSize: 16,
        color: ColorPalette.subtitle,
        letterSpacing: 0.5,
        fontVariant: [ 'small-caps' ],
        textTransform: 'lowercase'
    },
    subtitleAndroid: {
        fontSize: 16,
        color: ColorPalette.subtitle,
        fontFamily: 'Roboto',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    smallDot: {
        fontSize: 30,
        color: ColorPalette.subtitle,
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },

    /**
     * The style of the gradient button of {@code WelcomePage}.
     */
    gradientContainer: {
        height: 40,
        width: '100%',
        borderRadius: 20,
        backgroundColor: ColorPalette.secondaryLight
    },
    gradientButtonText: {
        fontSize: 17,
        color: ColorPalette.white,
        letterSpacing: 0.5,
        ...smallCapsOrUppercase
    },
    gradientButton: {
        width: '100%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },

    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: BoxModel.margin
    },

    forgotPassword: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    forgotPasswordLabel: {
        color: ColorPalette.primaryDarker,
        fontWeight: '300',
        fontSize: 12
    },

    separator: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    separatorLabel: {
        color: ColorPalette.lightGrey,
        fontSize: 16,
        fontVariant: [ 'small-caps' ],
        ...smallCapsOrUppercase
    },

    backButton: {
        width: 90,
        height: 45,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorPalette.buttonDarker
    },
    touchableWrapper: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backButtonLabel: {
        color: ColorPalette.white,
        paddingLeft: 5,
        fontSize: 12,
        letterSpacing: -0.0241176,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: {
            height: 0.774138,
            width: 0
        },
        textShadowRadius: 0.774138,
        ...smallCapsOrUppercase
    },
    backButtonIcon: {
        color: ColorPalette.white,
        fontSize: 20
    }
};
