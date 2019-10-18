// @flow

import React, { Component } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

import { IconSmashHexagon } from '../../../base/icons';
import {
    getLocalParticipant
} from '../../../base/participants';
import {
    SlidingView
} from '../../../base/react';
import { connect } from '../../../base/redux';

import { setSideBarVisible } from '../../actions';
import SideBarItem from './SideBarItem';
import styles from './styles';

type Props = {

    /**
     * Redux dispatch action
     */
    dispatch: Function,

    /**
     * The participants in the conference.
     *
     * @private
     */
    _participants: Array<any>,

    /**
     * The participants in the conference.
     *
     * @private
     */
    _localParticipant: Object,

    /**
     * Sets the side bar visible or hidden.
     */
    _visible: boolean
};

/**
 * A component rendering a welcome page sidebar.
 */
class ConferencePageSideBar extends Component<Props> {
    /**
     * Constructs a new SideBar instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onHideSideBar = this._onHideSideBar.bind(this);
        this._onOpenSettings = this._onOpenSettings.bind(this);
    }

    _renderContent(participants: Object) {
        return participants.map(participant => (
            <SideBarItem
                icon = { IconSmashHexagon }
                key = { participant.id }
                label = 'settings.title'
                onPress = { this._onOpenSettings }
                participant = { participant } />
        ));
    }

    /**
     * Implements React's {@link Component#render()}, renders the sidebar.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _localParticipant, _participants } = this.props;

        return (
            <SlidingView
                onHide = { this._onHideSideBar }
                position = 'left'
                show = { this.props._visible }
                style = { styles.sideBar } >
                <SafeAreaView style = { styles.sideBarBody }>
                    <ScrollView
                        style = { styles.itemContainer }>
                        <SideBarItem
                            isLocalParticipant = { _localParticipant.local }
                            participant = { _localParticipant } />
                        {this._renderContent(_participants)}
                    </ScrollView>
                </SafeAreaView>
            </SlidingView>
        );
    }

    _onHideSideBar: () => void;

    /**
     * Invoked when the sidebar has closed itself (e.g. Overlay pressed).
     *
     * @private
     * @returns {void}
     */
    _onHideSideBar() {
        this.props.dispatch(setSideBarVisible(false));
    }

    _onOpenSettings: () => void;

    /**
     * Shows the {@link SettingsView}.
     *
     * @private
     * @returns {void}
     */
    _onOpenSettings() {
        const { dispatch } = this.props;

        dispatch(setSideBarVisible(false));
    }
}

/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {Props}
 */
function _mapStateToProps(state: Object) {
    const _localParticipant = getLocalParticipant(state);
    const participants = state['features/base/participants'];

    return {
        _localParticipant,
        _participants: participants.filter(p => !p.local),
        _visible: state['features/conference'].sideBarVisible
    };
}

export default connect(_mapStateToProps)(ConferencePageSideBar);
