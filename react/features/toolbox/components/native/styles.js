// @flow

import { ColorSchemeRegistry, schemeColor } from '../../../base/color-scheme';
import { BoxModel, ColorPalette } from '../../../base/styles';

// Toolbox, toolbar:

/**
 * The style of toolbar buttons.
 */
const toolbarButton = {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 8
};

/**
 * The icon style of the toolbar buttons.
 */
const toolbarButtonIcon = {
    alignSelf: 'center',
    color: ColorPalette.darkGrey,
    fontSize: 26
};

/**
 * The style of toolbar buttons which display white icons.
 */
const whiteToolbarButton = {
    ...toolbarButton,
    backgroundColor: 'transparent'
};

/**
 * The icon style of toolbar buttons which display white icons.
 */
const whiteToolbarButtonIcon = {
    ...toolbarButtonIcon
};

/**
 * The Toolbox and toolbar related styles.
 */
const styles = {

    /**
     * The style of the toolbar.
     */
    toolbar: {
        alignItems: 'center',
        flexDirection: 'row',
        flexGrow: 0,
        justifyContent: 'space-evenly',
        marginBottom: BoxModel.margin + 5,
        paddingHorizontal: BoxModel.margin
    },

    /**
     * The style of the root/top-level {@link Container} of {@link Toolbox}.
     */
    toolbox: {
        flexDirection: 'column',
        flexGrow: 0
    }
};

export default styles;

/**
 * Color schemed styles for the @{Toolbox} component.
 */
ColorSchemeRegistry.register('Toolbox', {
    /**
     * Styles for buttons in the toolbar.
     */
    buttonStyles: {
        iconStyle: toolbarButtonIcon,
        hexagonIconStyles: {
            fontSize: 50,
        },
        style: toolbarButton
    },

    buttonStylesBorderless: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton,
            backgroundColor: 'transparent'
        }
    },

    /**
     * Overrides to the standard styles that we apply to the chat button, as
     * that behaves slightly differently to other buttons.
     */
    chatButtonOverride: {
        toggled: {
            backgroundColor: 'transparent'
        }
    },

    callScreenButtonStyles: {
        iconStyle: {
            ...whiteToolbarButtonIcon,
            fontSize: 50
        },
        hexagonIconStyles: {
            fontSize: 60,
        },
        style: {
            ...toolbarButton
        },
        underlayColor: ColorPalette.buttonUnderlay
    },

    hangupButtonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        hexagonIconStyles: {
            fontSize: 50,
        },
        style: {
            ...toolbarButton
        },
        underlayColor: ColorPalette.buttonUnderlay
    },

    /**
     * Styles for toggled buttons in the toolbar.
     */
    toggledButtonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        hexagonIconStyles: {
            fontSize: 50,
        },
        style: {
            ...whiteToolbarButton,
            borderColor: schemeColor('buttonToggledBorder')
        }
    }
});
