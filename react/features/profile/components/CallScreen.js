// @flow

import React from 'react';
import {
    View,
    ImageBackground,
    Text,
} from 'react-native';
import styles from './styles';
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import {HangupButton, AcceptButton} from "../../toolbox/components";
import {ColorSchemeRegistry} from "../../base/color-scheme";
import {navigateToScreen} from "../../base/app";
import {hangup, accept} from "../actions";

function CallScreen({dispatch, _loading = {}, _error, _call, _styles}) {
    const {roomId, jwt, friend, isCaller} = _call;
    const {callScreenButtonStyles} = _styles;

    function onHangup() {
        dispatch(hangup(isCaller, friend.profileRef, roomId));
        dispatch(navigateToScreen('ProfileScreen'));
    }

    function onAccept() {
        dispatch(accept(friend.profileRef, roomId));
    }

    return (
        <ImageBackground style = {styles.callContainer} source={{uri: friend.picture}} blurRadius={10}>
            <View style={styles.callHeader}>
                <HexagononImage friend={ friend } big />
                <View style={styles.callHeaderText}>
                    <Text style={styles.callHeaderNameText}>
                        {friend.name}
                    </Text>
                    <Text style={styles.callHeaderSubtitleText}>
                        {
                            isCaller ? 'waiting...' : 'calling...'
                        }
                    </Text>
                </View>
            </View>
            <View style={styles.callBody}>
                <HangupButton styles={callScreenButtonStyles} onPress={() => onHangup()}/>
                {
                    !isCaller && <AcceptButton styles={callScreenButtonStyles} onPress={() => onAccept()}/>
                }
            </View>
        </ImageBackground>
    );
}

function _mapStateToProps(state: Object) {
    return {
        _loading: state['features/contacts-sync'].loading,
        _error: state['features/contacts-sync'].error,
        _call: state['features/contacts-sync'].call,
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
    };
}


export default translate(connect(_mapStateToProps)(CallScreen));
