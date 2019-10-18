// @flow

import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { AbstractParticipantsListButton } from '../../../base/toolbox';
import type { AbstractButtonProps } from '../../../base/toolbox';

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
    accessibilityLabel = 'toolbar.accessibilityLabel.mute';
    label = 'toolbar.mute';
    tooltip = 'toolbar.mute';
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
        _visible: state['features/conference'].sideBarVisible
    };
}

export default translate(connect(_mapStateToProps)(ParticipantsListButton));
