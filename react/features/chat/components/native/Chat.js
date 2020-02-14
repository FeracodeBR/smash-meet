// @flow

import React from 'react';
import { KeyboardAvoidingView, SafeAreaView, View } from 'react-native';

import { ColorSchemeRegistry } from '../../../../../react/features/base/color-scheme';
import { translate } from '../../../../../react/features/base/i18n';
import { HeaderWithNavigation, SlidingView } from '../../../../../react/features/base/react';
import { connect } from '../../../../../react/features/base/redux';
import { StyleType } from '../../../../../react/features/base/styles';

import AbstractChat, {
    _mapDispatchToProps,
    _mapStateToProps as _abstractMapStateToProps,
    type Props as AbstractProps
} from '../AbstractChat';

import ChatInputBar from './ChatInputBar';
import MessageContainer from './MessageContainer';
import MessageRecipient from './MessageRecipient';
import styles from './styles';

type Props = AbstractProps & {

    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: StyleType
};

/**
 * Implements a React native component that renders the chat window (modal) of
 * the mobile client.
 */
class Chat extends AbstractChat<Props> {
    /**
     * Instantiates a new instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._onClose = this._onClose.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {

        return (
            <SlidingView
                onHide = { this._onClose }
                position = 'bottom'
                show = { this.props._isOpen }>
                <KeyboardAvoidingView
                    behavior = 'padding'
                    style = { styles.chatContainer }>
                    <HeaderWithNavigation
                        headerLabelKey = 'chat.title'
                        onPressBack = { this._onClose } />
                    <SafeAreaView style = { styles.backdrop }>
                        <MessageContainer messages = { this.props._messages } />
                        <MessageRecipient />
                    </SafeAreaView>
                    <SafeAreaView style = { styles.footer }>
                        <ChatInputBar onSend = { this.props._onSendMessage } />
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </SlidingView>
        );
    }

    _onClose: () => boolean

    /**
     * Closes the chat window.
     *
     * @returns {boolean}
     */
    _onClose() {
        if (this.props._isOpen) {
            this.props._onToggleChat();

            return true;
        }

        return false;
    }
}

/**
 * Maps part of the redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        ..._abstractMapStateToProps(state),
        _styles: ColorSchemeRegistry.get(state, 'Chat')
    };
}

export default translate(connect(_mapStateToProps, _mapDispatchToProps)(Chat));
