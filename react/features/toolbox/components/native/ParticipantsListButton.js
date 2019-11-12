// @flow

import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { AbstractParticipantsListButton } from '../../../base/toolbox';
import type { AbstractButtonProps } from '../../../base/toolbox';
import {
    ACTION_SHORTCUT_TRIGGERED,
    AUDIO_MUTE,
    createShortcutEvent,
    sendAnalytics
} from '../../../analytics';
import { setSideBarVisible } from '../../../conference';
import { toggleToolboxVisible } from '../../';

declare var APP: Object;

/**
 * The type of the React {@code Component} props of {@link ToggleCameraButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether audio is currently muted or not.
     */
    _participantsIsShown: boolean,

    /**
     * Whether the button is disabled.
     */
    _disabled: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
}

/**
 * An implementation of a button for toggling the camera facing mode.
 */
class ParticipantsListButton extends AbstractParticipantsListButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.show_participants';
    label = 'toolbar.show_participants';
    tooltip = 'toolbar.show_participants';

    /**
     * Initializes a new {@code AudioMuteButton} instance.
     *
     * @param {Props} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onKeyboardShortcut = this._onKeyboardShortcut.bind(this);
    }

    /**
     * Registers the keyboard shortcut that toggles the audio muting.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        typeof APP === 'undefined'
        || APP.keyboardshortcut.registerShortcut(
            'M',
            null,
            this._onKeyboardShortcut,
            'keyboardShortcuts.show_participants');
    }

    /**
     * Unregisters the keyboard shortcut that toggles the audio muting.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        typeof APP === 'undefined'
        || APP.keyboardshortcut.unregisterShortcut('P');
    }

    /**
     * Indicates if audio is currently muted ot nor.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isParticipantsShown() {
        return this.props._isParticipantsShown;
    }

    _onKeyboardShortcut: () => void;

    /**
     * Creates an analytics keyboard shortcut event and dispatches an action to
     * toggle the audio muting.
     *
     * @private
     * @returns {void}
     */
    _onKeyboardShortcut() {
        sendAnalytics(
            createShortcutEvent(
                AUDIO_MUTE,
                ACTION_SHORTCUT_TRIGGERED,
                { enable: !this._isAudioMuted() }));

        super._handleClick();
    }

    /**
     * Changes the muted state.
     *
     * @param {boolean} audioMuted - Whether audio should be muted or not.
     * @protected
     * @returns {void}
     */
    _setIsParticipantsShown(participantsIsShow: boolean) {
        this.props.dispatch(setSideBarVisible(participantsIsShow, /* ensureTrack */ true));
        this.props.dispatch(toggleToolboxVisible());
    }

    /**
     * Return a boolean value indicating if this button is disabled or not.
     *
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._disabled;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ToggleCameraButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean,
 *     _videoMuted: boolean
 * }}
 */
function _mapStateToProps(state): Object {

    return {
        _participantsIsShown: state['features/conference'].sideBarVisible
    };
}

export default translate(connect(_mapStateToProps)(ParticipantsListButton));
