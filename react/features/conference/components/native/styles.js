import { Dimensions } from 'react-native';

import { BoxModel, ColorPalette, fixAndroidViewClipping } from '../../../base/styles';

import { FILMSTRIP_SIZE } from '../../../filmstrip';

export const NAVBAR_GRADIENT_COLORS = [ '#000000FF', '#00000000' ];

// From brand guideline
const BOTTOM_GRADIENT_HEIGHT = 290;
const DEFAULT_GRADIENT_SIZE = 140;

/**
 * The styles of the feature conference.
 */
export default {

    bottomGradient: {
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: DEFAULT_GRADIENT_SIZE,
        left: 0,
        position: 'absolute',
        right: 0
    },

    /**
     * {@code Conference} style.
     */
    conference: fixAndroidViewClipping({
        alignSelf: 'stretch',
        backgroundColor: ColorPalette.appBackground,
        flex: 1
    }),

    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flex: 1
    },

    gradientStretchBottom: {
        height: BOTTOM_GRADIENT_HEIGHT
    },

    gradientStretchTop: {
        height: DEFAULT_GRADIENT_SIZE
    },

    /**
     * View that contains the indicators.
     */
    indicatorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: BoxModel.margin
    },

    /**
     * Indicator container for wide aspect ratio.
     */
    indicatorContainerWide: {
        marginRight: FILMSTRIP_SIZE + BoxModel.margin
    },

    labelWrapper: {
        flexDirection: 'column',
        position: 'absolute',
        right: 0,
        top: 0
    },

    navBarButton: {
        iconStyle: {
            color: ColorPalette.white,
            fontSize: 24
        },

        underlayColor: 'transparent'
    },

    navBarContainer: {
        flexDirection: 'column',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },

    navBarSafeView: {
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },

    navBarWrapper: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        height: 44,
        justifyContent: 'space-between',
        paddingHorizontal: 14
    },

    roomName: {
        color: ColorPalette.white,
        fontSize: 17,
        fontWeight: '400',
        textAlign: 'center'
    },

    roomNameWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        left: 0,
        position: 'absolute',
        right: 0
    },
    roomNameTitle: {
        flex: 6
    },
    roomNameAction: {
        flex: 2
    },

    /**
     * The style of the {@link View} which expands over the whole
     * {@link Conference} area and splits it between the {@link Filmstrip} and
     * the {@link Toolbox}.
     */
    toolboxAndFilmstripContainer: {
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        left: 0,
        paddingBottom: BoxModel.padding,
        position: 'absolute',
        right: 0,

        // Both on Android and iOS there is the status bar which may be visible.
        // On iPhone X there is the notch. In the two cases BoxModel.margin is
        // not enough.
        top: BoxModel.margin * 3
    },

    sideBar: {
        width: 250,
        height: Dimensions.get('window').height
    },

    /**
     * The body of the side bar where the items are.
     */
    sideBarBody: {
        backgroundColor: ColorPalette.screenDarker,
        flex: 1
    },

    /**
     * The style of the side bar header.
     */
    sideBarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: BoxModel.padding
    },
    sideBarHeaderTitle: {
        fontSize: 18,
        color: ColorPalette.white,
        textAlign: 'center'
    },
    sideBarHeaderIcon: {
        fontSize: 22,
        color: ColorPalette.white
    },
    sideBarHeaderAction: {
        flex: 2
    },
    sideBarHeaderText: {
        flex: 6
    },

    /**
     * Style of the menu items in the side bar.
     */
    sideBarItem: {
        padding: 12
    },

    sideBarDescriptionContainer: {
        justifyContent: 'center',
        marginLeft: 8
    },

    sideBarAvatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        height: 30,
        width: 30,
        backgroundColor: ColorPalette.darkGrey
    },

    sideBarAvatar: {
        height: 30,
        width: 30,
        borderRadius: 15
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
        color: ColorPalette.white,
        fontSize: 38
    },

    sideBarItemIconSmall: {
        color: ColorPalette.white,
        fontSize: 18,
        marginRight: 15
    },

    /**
     * The label of the side bar item touchables.
     */
    sideBarItemText: {
        color: '#DFDFDF',
        fontSize: 10,
        lineHeight: 28
    }
};
