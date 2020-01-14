import React from 'react';
import { View, Image, Text } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { IconSmashHexagon, IconSmashHexagonBig } from '../../../icons/svg';
import {getProfileColor} from '../../../../profile/functions';
import {ColorPalette} from "../../../styles/components/styles";

export default function({ big, friend, showStatus }) {

    const size = big ? 120 : 42;

    function renderEmptyAvatar() {
        const initialLetter = (friend.name).substr(0, 1).toUpperCase();

        if(!friend.color) {
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

            friend.color = lastNumber - 1 < 0 ? colors[0] : colors[lastNumber - 1];
        }

        return (
            <View style = {{ height: size, width: size, alignItems: 'center', justifyContent: 'center', backgroundColor: getProfileColor(friend.color)}}>
                <Text style={{color: 'white', fontSize: big ? 42 : 22, fontWeight: '500'}}>
                    {initialLetter}
                </Text>
            </View>
        );
    }

    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            {
                friend.profileRef && showStatus && (
                    <View style={{
                        position: 'absolute',
                        top: 1,
                        right: 1,
                        borderWidth: 1,
                        borderColor: ColorPalette.screen,
                        backgroundColor: friend.status === 'online' ? 'lime' : '#BFBFBF',
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        zIndex: 999
                    }}/>
                )
            }
            <MaskedView
                maskElement = {
                    <View
                        style = {{
                            height: size,
                            width: size,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {
                            big ?
                                <IconSmashHexagonBig /> :
                                <IconSmashHexagon/>
                        }
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
        </View>
    );
}