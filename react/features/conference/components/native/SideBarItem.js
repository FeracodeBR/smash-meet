// @flow

import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';

import { Icon, IconCameraDisabled, IconMicDisabled } from '../../../base/icons';

import styles from './styles';
import { connect } from '../../../base/redux';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';
import { MEDIA_TYPE } from '../../../base/media';
import {
    getParticipantCount,
    isEveryoneModerator, PARTICIPANT_ROLE
} from '../../../base/participants';
import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { getInitials } from '../../../base/avatar';

type Props = {


    /**
     * Whether local audio (microphone) is muted or not.
     */
    _audioMuted: boolean,

    /**
     * Whether to show the dominant speaker indicator or not.
     */
    _renderDominantSpeakerIndicator: boolean,

    /**
     * Whether to show the moderator indicator or not.
     */
    _renderModeratorIndicator: boolean,

    /**
     * The Redux representation of the participant's video track.
     */
    _videoTrack: Object,

    /**
     * The icon of the item.
     */
    icon: Object,


    isLocalParticipant: boolean,


    participant: Object,

    /**
     * The i18n label of the item.
     */
    label: string,

    /**
     * The function to be invoked when the item is pressed
     * if the item is a button.
     */
    onPress: Function,

    /**
     * The translate function.
     */
    t: Function,

    /**
     * The URL of the link, if this item is a link.
     */
    url: string
};

/**
 * A component rendering an item in the system sidebar.
 */
class SideBarItem extends Component<Props> {

    /**
     * Implements React's {@link Component#render()}, renders the sidebar item.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */

    _renderAvatar() {
        const { name, loadableAvatarUrl } = this.props.participant;
        const initials = getInitials(name);

        if (loadableAvatarUrl) {
            return (<Image
                source = {{ uri: loadableAvatarUrl }}
                style = { styles.sideBarAvatar } />);
        }

        return (
            <Text style = { styles.sideBarItemText }>
                { initials }
            </Text>
        );
    }
    render() {
        const { participant, isLocalParticipant, _audioMuted, _videoTrack } = this.props;
        const { name } = participant;
        const displayName = isLocalParticipant ? `${name} ( me )` : name;
        const videoMuted = !_videoTrack || _videoTrack.muted;

        return (
            <View
                style = { styles.sideBarItem }>
                <View style = { styles.sideBarItemButtonContainer }>
                    <View style = { styles.sideBarAvatarContainer }>
                        { this._renderAvatar()}
                    </View>
                    <View style = { styles.sideBarDescriptionContainer }>
                        <Text style = { styles.sideBarItemText }>
                            { displayName }
                        </Text>
                        <View style = { styles.sideBarItemButtonContainer }>
                            { _audioMuted && <Icon
                                src = { IconMicDisabled }
                                style = { styles.sideBarItemIconSmall } />}
                            {videoMuted && <Icon
                                src = { IconCameraDisabled }
                                style = { styles.sideBarItemIconSmall } />}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

}

function _mapStateToProps(state, ownProps) {
    const tracks = state['features/base/tracks'];
    const { participant } = ownProps;
    const id = participant.id;
    const audioTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, id);
    const videoTrack
        = getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.VIDEO, id);
    const participantCount = getParticipantCount(state);
    const renderDominantSpeakerIndicator = participant.dominantSpeaker && participantCount > 2;
    const _isEveryoneModerator = isEveryoneModerator(state);
    const renderModeratorIndicator = !_isEveryoneModerator && participant.role === PARTICIPANT_ROLE.MODERATOR;

    return {
        _audioMuted: audioTrack?.muted ?? true,
        _renderDominantSpeakerIndicator: renderDominantSpeakerIndicator,
        _renderModeratorIndicator: renderModeratorIndicator,
        _styles: ColorSchemeRegistry.get(state, 'Thumbnail'),
        _videoTrack: videoTrack
    };
}

export default connect(_mapStateToProps)(SideBarItem);
