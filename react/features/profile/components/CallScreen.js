// @flow

import React, {useState, useEffect} from 'react';
import {
    View,
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
} from 'react-native';
import {

} from '../actions';
import styles from './styles';
import {
    IconMenuUp,
} from '../../base/icons/svg';
import HexagononImage from '../../base/react/components/native/HexagononImage';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';

function CallScreen({dispatch, _loading = {}, _error, _call}) {
    const {roomId, jwt, friend} = _call;

    return (
        <ImageBackground style = {styles.callContainer} source={{uri: friend.picture}} blurRadius={10}>
            <View style={styles.callHeader}>
                <View>
                    <HexagononImage />
                </View>
                <View>
                    <Text>
                        Lucas Baumgart Costa
                    </Text>
                    <Text>
                        Calling...
                    </Text>
                </View>
            </View>
            <View style={styles.callBody}>
                <View>
                {/*buttons*/}
                </View>
            </View>
        </ImageBackground>
    );
}

function _mapStateToProps(state: Object) {
    return {
        _loading: state['features/contacts-sync'].loading,
        _error: state['features/contacts-sync'].error,
        _call: state['features/contacts-sync'].call,
    };
}


export default translate(connect(_mapStateToProps)(CallScreen));
