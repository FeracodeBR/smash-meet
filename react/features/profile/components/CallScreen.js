// @flow

import React, { useEffect } from 'react';
import {
    View,
    ImageBackground,
    Text
} from 'react-native';
import styles from './styles';
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { HangupButton, AcceptButton } from '../../toolbox/components';
import { ColorSchemeRegistry } from '../../base/color-scheme';
import { navigateToScreen } from '../../base/app';
import { hangup, accept } from '../actions';
import { playSound, stopSound } from '../../base/sounds';
import { CONFERENCE_SOUND_ID, WAITING_SOUND_ID } from '../../recording';
import WebSocket from "../../websocket/WebSocket";
import {CALL_TIMEOUT} from "../actionTypes";

function CallScreen({ dispatch, _loading = {}, _error, _call, _callTimeout, _route, _styles }) {
    const { roomId, dateTime, sender, receiver, jwt, friend, status, isCaller } = _call;
    const { callScreenButtonStyles } = _styles;
    const soundId = isCaller ? WAITING_SOUND_ID : CONFERENCE_SOUND_ID;

    useEffect(() => {
        if(_callTimeout) clearTimeout(_callTimeout);

        const callTimeout = setTimeout(() => {
            if(_route === 'CallScreen') {
                dispatch(navigateToScreen('ProfileScreen'));
                dispatch(stopSound(soundId));
            }
        }, 30000);

        dispatch({
            type: CALL_TIMEOUT,
            callTimeout
        });

        dispatch(playSound(soundId));

        return () => {
            dispatch(stopSound(soundId));
        };
    }, []);

    function onHangup() {
        dispatch(hangup(isCaller, friend.profileRef, roomId));
        dispatch(navigateToScreen('ProfileScreen'));
    }

    function onAccept() {
        dispatch(navigateToScreen('ProfileScreen'));
        dispatch(accept(_call, WebSocket.io.id));
    }

    function renderContent() {
        return (
            <>
                <View style = { styles.overlay } />
                <View style = { styles.callHeader }>
                    <HexagononImage
                        friend = { friend }
                        big = { true } />
                    <View style = { styles.callHeaderText }>
                        <Text style = { styles.callHeaderNameText }>
                            {friend.name}
                        </Text>
                        <Text style = { styles.callHeaderSubtitleText }>
                            {status}
                        </Text>
                    </View>
                </View>
                <View style = { styles.callBody }>
                    <HangupButton
                        styles = { callScreenButtonStyles }
                        onPress = { () => onHangup() } />
                    {
                        !isCaller && <AcceptButton
                            styles = { callScreenButtonStyles }
                            onPress = { () => onAccept() } />
                    }
                </View>
            </>
        );
    }

    return friend.picture
        ? <ImageBackground
            style = { styles.callContainer }
            source = {{ uri: friend.picture }}
            blurRadius = { 10 }>
            {renderContent()}
        </ImageBackground>
        : <View style = { styles.callContainer }>
            {renderContent()}
        </View>;
}

function _mapStateToProps(state: Object) {
    return {
        _loading: state['features/contacts-sync'].loading,
        _error: state['features/contacts-sync'].error,
        _call: state['features/contacts-sync'].call,
        _callTimeout: state['features/contacts-sync'].callTimeout,
        _route: state['features/base/app'].route,
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
    };
}


export default translate(connect(_mapStateToProps)(CallScreen));
