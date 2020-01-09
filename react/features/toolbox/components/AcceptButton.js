// @flow

import _ from 'lodash';

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { appNavigate } from '../../app';
import { disconnect } from '../../base/connection';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import type { AbstractButtonProps } from '../../base/toolbox';
import AbstractAcceptButton from "../../base/toolbox/components/AbstractAcceptButton";

/**
 * The type of the React {@code Component} props of {@link HangupButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @extends AbstractAcceptButton
 */
class AcceptButton extends AbstractAcceptButton<Props, *> {
    _accept: Function;

    accessibilityLabel = 'toolbar.accessibilityLabel.accept';
    label = 'toolbar.accept';
    tooltip = 'toolbar.accept';

    /**
     * Initializes a new AcceptBUTTON instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this._accept = props.onPress ?
            () => props.onPress() :
            _.once(() => {
                sendAnalytics(createToolbarEvent('accept'));

                // FIXME: these should be unified.
                if (navigator.product === 'ReactNative') {
                    this.props.dispatch(appNavigate(undefined));
                } else {
                    this.props.dispatch(disconnect(true));
                }
            });
    }

    /**
     * Helper function to perform the actual accept action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doAccept() {
        this._accept();
    }
}

export default translate(connect()(AcceptButton));
