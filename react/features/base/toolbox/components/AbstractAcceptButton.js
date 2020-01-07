// @flow

import { IconPhone, IconAcceptHexagon } from '../../icons';

import AbstractButton from './AbstractButton';
import type { Props } from './AbstractButton';

/**
 * An abstract implementation of a button for disconnecting a conference.
 */
export default class AbstractAcceptButton<P : Props, S: *>
    extends AbstractButton<P, S> {

    icon = IconPhone;
    containerIcon = IconAcceptHexagon;

    /**
     * Handles clicking / pressing the button, and disconnects the conference.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this._doAccept();
    }

    /**
     * Helper function to perform the actual hangup action.
     *
     * @protected
     * @returns {void}
     */
    _doAccept() {
        // To be implemented by subclass.
    }
}
