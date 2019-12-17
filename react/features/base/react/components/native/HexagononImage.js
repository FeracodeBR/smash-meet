import React from 'react';
import { View, Image } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { IconSmashHexagon } from '../../../icons/svg';

export default function({ uri, size }) {
    return (
        <MaskedView
            maskElement = {
                <View
                    style = {{
                        height: size,
                        width: size,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                    <IconSmashHexagon />

                </View>
            }>

            <Image
                resizeMethod = 'resize'
                resizeMode = 'cover'
                source = {{ uri }}
                style = {{ height: size,
                    width: size }} />
        </MaskedView>
    );
}
