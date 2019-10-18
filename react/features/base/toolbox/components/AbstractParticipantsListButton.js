// @flow

import {
    IconSmashParticipants,
    IconSmashHexagonDisabled,
    IconSmashCircularContainer,
    IconSmashCamera
} from '../../icons';

import AbstractButton from './AbstractButton';
import type { Props } from './AbstractButton';

/**
 * An abstract implementation of a button for toggling audio mute.
 */
export default class AbstractParticipantsListButton<P: Props, S: *>
    extends AbstractButton<P, S> {

    icon = IconSmashParticipants;
    containerIcon = IconSmashCircularContainer;
    toggledIcon = IconSmashCamera;
    toggledIconContainerIcon = IconSmashHexagonDisabled;

    /**
     * Handles clicking / pressing the button, and toggles the audio mute state
     * accordingly.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        console.log('clikei');
    }

    /**
     * Helper function to be implemented by subclasses, which must return a
     * boolean value indicating if audio is muted or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isParticipantsShown() {
        // To be implemented by subclass.
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this._isParticipantsShown();
    }

    _setIsParticipantsShown(participantsIsShow: boolean) { // eslint-disable-line no-unused-vars
        // To be implemented by subclass.
    }
}
