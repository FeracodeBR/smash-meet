import React from 'react';
import { View, Image, Text } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { IconSmashHexagon } from '../../../icons/svg';

export default function({ size, friend }) {
    function renderEmptyAvatar() {
        const initialLetter = (friend.name).substr(0, 1).toUpperCase();
        const numbers = (friend._id || friend.id).replace(/[^0-9]/g, '');
        const lastNumber = numbers.substring(numbers.length - 1);

        const colors = [
            '#AACD47',
            '#92DCF7',
            '#3398DB',
            '#9B59B6',
            '#DC4938',
            '#E91D63',
            '#F1C411',
            '#E67D22',
            '#607D8B',
        ];

        return (
            <View style = {{ height: size, width: size, alignItems: 'center', justifyContent: 'center', backgroundColor: colors[lastNumber - 1] }}>
                <Text style={{color: 'white', fontSize: 22, fontWeight: '500'}}>
                    {initialLetter}
                </Text>
            </View>
        );
    }

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

            {
                friend.picture ?
                    <Image
                        resizeMethod = 'resize'
                        resizeMode = 'cover'
                        source = {{ uri: friend.picture }}
                        style = {{ height: size, width: size }} />
                        :
                    renderEmptyAvatar()
            }
        </MaskedView>
    );
}
