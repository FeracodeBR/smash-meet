// @flow

import { BoxModel, ColorPalette } from '../../../base/styles';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

/**
 * The styles of the feature chat.
 *
 * NOTE: Sizes and colors come from the 8x8 guidelines. This is the first
 * component to receive this treating, if others happen to have similar, we
 * need to extract the brand colors and sizes into a branding feature (planned
 * for the future).
 */
export default {

    /**
     * Wrapper View for the avatar.
     */
    avatarWrapper: {
        marginRight: 8,
        width: 32
    },

    /**
     * Background of the chat screen.
     */
    backdrop: {
        backgroundColor: '#101013',
        flex: 1
    },

    chatContainer: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column'
    },

    chatLink: {
        color: ColorPalette.blue
    },

    footer: {
        paddingHorizontal: 10,
        paddingBottom: getBottomSpace(),
        backgroundColor: ColorPalette.headerBackground
    },

    /**
     * Wrapper for the details together, such as name, message and time.
     */
    detailsWrapper: {
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'column'
    },

    /**
     * The text node for the display name.
     */
    displayName: {
        color: ColorPalette.white,
        fontWeight: 'bold',
        fontSize: 13
    },

    /**
     * A special padding to avoid issues on some devices (such as Android devices with custom suggestions bar).
     */
    extraBarPadding: {
        paddingBottom: 30
    },

    inputBar: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: BoxModel.padding,
        paddingVertical: BoxModel.padding
    },

    inputField: {
        color: ColorPalette.white,
        flex: 1,
        height: 40,
        padding: 12,
        borderRadius: 50,
        backgroundColor: '#606266'
    },

    messageContainer: {
        flex: 1
    },

    messageRecipientCancelIcon: {
        color: ColorPalette.white,
        fontSize: 18
    },

    messageRecipientContainer: {
        alignItems: 'center',
        backgroundColor: ColorPalette.warning,
        flexDirection: 'row',
        padding: BoxModel.padding
    },

    messageRecipientText: {
        color: ColorPalette.white,
        flex: 1
    },

    /**
     * The message text itself.
     */
    messageText: {
        color: ColorPalette.white
    },

    /**
     * Wrapper View for the entire block.
     */
    messageWrapper: {
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 17,
        marginVertical: 4,
        opacity: 1
    },

    /**
     * Style modifier for the {@code detailsWrapper} for own messages.
     */
    ownMessageDetailsWrapper: {
        alignItems: 'flex-end'
    },

    /**
     * Style modifier for the {@code textWrapper} for own messages.
     */
    ownTextWrapper: {
        backgroundColor: 'rgb(84, 160, 165)',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 0
    },

    replyWrapper: {
        alignItems: 'center',
        flexDirection: 'row'
    },

    replyStyles: {
        iconStyle: {
            color: 'rgb(118, 136, 152)',
            fontSize: 22,
            margin: BoxModel.margin / 2
        }
    },

    privateNotice: {
        color: ColorPalette.warning,
        fontSize: 13,
        fontStyle: 'italic'
    },

    sendButton: {
        paddingLeft: 10
    },
    sendButtonIcon: {
        fontSize: 20,
        marginHorizontal: 4
    },

    timestampContainer: {
        alignItems: 'flex-end'
    },

    /**
     * Style modifier for system (error) messages.
     */
    systemTextWrapper: {
        backgroundColor: 'rgb(247, 215, 215)'
    },

    /**
     * Wrapper for the name and the message text.
     */
    textWrapper: {
        alignItems: 'flex-start',
        backgroundColor: 'rgb(142, 186, 180)',
        borderRadius: 8,
        borderTopLeftRadius: 0,
        flexDirection: 'column',
        padding: 9
    },

    /**
     * Text node for the timestamp.
     */
    timeText: {
        color: ColorPalette.white,
        fontSize: 13
    }
};
