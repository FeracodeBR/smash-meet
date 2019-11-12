import React from 'react';
import {
    Animated,
    Keyboard,
    SafeAreaView,
    TextInput,
    TouchableHighlight,
    View,
    TouchableOpacity,
    Platform,
    Image
} from 'react-native';

import { getName } from '../../app';
import logo from '../../../../images/smash-meet-logo.png';

import { ColorSchemeRegistry } from '../../base/color-scheme';
import { translate } from '../../base/i18n';
import { MEDIA_TYPE } from '../../base/media';
import { LoadingIndicator, Text } from '../../base/react';
import { connect } from '../../base/redux';
import { ColorPalette } from '../../base/styles';
import {
    createDesiredLocalTracks,
    destroyLocalTracks
} from '../../base/tracks';

import { setSideBarVisible } from '../actions';

import {
    AbstractWelcomePage,
    _mapStateToProps as _abstractMapStateToProps
} from './AbstractWelcomePage';
import styles, { PLACEHOLDER_TEXT_COLOR } from './styles';
import LinearGradient from 'react-native-linear-gradient';

/**
 * The native container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage {
    /**
     * Constructor of the Component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state._fieldFocused = false;
        this.state.hintBoxAnimation = new Animated.Value(0);

        // Bind event handlers so they are only bound once per instance.
        this._onFieldFocusChange = this._onFieldFocusChange.bind(this);
        this._onShowSideBar = this._onShowSideBar.bind(this);
        this._renderHintBox = this._renderHintBox.bind(this);

        // Specially bind functions to avoid function definition on render.
        this._onFieldBlur = this._onFieldFocusChange.bind(this, false);
        this._onFieldFocus = this._onFieldFocusChange.bind(this, true);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs. Creates a local video track if none
     * is available and the camera permission was already granted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();

        const { dispatch } = this.props;

        if (this.props._settings.startAudioOnly) {
            dispatch(destroyLocalTracks());
        } else {
            // Make sure we don't request the permission for the camera from
            // the start. We will, however, create a video track iff the user
            // already granted the permission.
            navigator.permissions.query({ name: 'camera' }).then(response => {
                response === 'granted'
                    && dispatch(createDesiredLocalTracks(MEDIA_TYPE.VIDEO));
            });
        }
    }

    /**
     * Implements React's {@link Component#render()}. Renders a prompt for
     * entering a room name.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return this._renderFullUI();
    }

    /**
     * Constructs a style array to handle the hint box animation.
     *
     * @private
     * @returns {Array<Object>}
     */
    _getHintBoxStyle() {
        return [
            styles.hintContainer,
            {
                opacity: this.state.hintBoxAnimation
            }
        ];
    }

    /**
     * Callback for when the room field's focus changes so the hint box
     * must be rendered or removed.
     *
     * @private
     * @param {boolean} focused - The focused state of the field.
     * @returns {void}
     */
    _onFieldFocusChange(focused) {
        focused
            && this.setState({
                _fieldFocused: true
            });

        Animated.timing(
            this.state.hintBoxAnimation,
            {
                duration: 300,
                toValue: focused ? 1 : 0
            })
            .start(animationState =>
                animationState.finished
                    && !focused
                    && this.setState({
                        _fieldFocused: false
                    }));
    }

    /**
     * Toggles the side bar.
     *
     * @private
     * @returns {void}
     */
    _onShowSideBar() {
        Keyboard.dismiss();
        this.props.dispatch(setSideBarVisible(true));
    }

    /**
     * Renders the hint box if necessary.
     *
     * @private
     * @returns {React$Node}
     */
    _renderHintBox() {
        if (this.state._fieldFocused) {
            const { t } = this.props;

            return (
                <Animated.View style = { this._getHintBoxStyle() }>
                    <View style = { styles.hintTextContainer } >
                        <Text style = { styles.hintText }>
                            { t('welcomepage.roomnameHint') }
                        </Text>
                    </View>
                    <View style = { styles.hintButtonContainer } >
                        { this._renderJoinButton() }
                    </View>
                </Animated.View>
            );
        }

        return null;
    }

    /**
     * Renders the join button.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderJoinButton() {
        const { t } = this.props;
        let children;


        if (this.state.joining) {
            // TouchableHighlight is picky about what its children can be, so
            // wrap it in a native component, i.e. View to avoid having to
            // modify non-native children.
            children = (
                <View>
                    <LoadingIndicator
                        color = { styles.buttonText.color }
                        size = 'small' />
                </View>
            );
        } else {
            children = (
                <Text style = { styles.buttonText }>
                    { this.props.t('welcomepage.join') }
                </Text>
            );
        }


        const buttonDisabled = this._isJoinDisabled();

        return (
            <TouchableHighlight
                accessibilityLabel =
                    { t('welcomepage.accessibilityLabel.join') }
                disabled = { buttonDisabled }
                onPress = { this._onJoin }
                style = { [
                    styles.button,
                    buttonDisabled ? styles.buttonDisabled : null
                ] }
                underlayColor = { ColorPalette.white }>
                { children }
            </TouchableHighlight>
        );
    }

    /**
     * Renders the full welcome page.
     *
     * @returns {ReactElement}
     */
    _renderFullUI() {
        const roomnameAccLabel = 'welcomepage.accessibilityLabel.roomname';
        const { _headerStyles, t } = this.props;

        return (
            <View style = { _headerStyles }>
                <SafeAreaView style = { styles.roomContainer } >
                    <View style = { styles.header }>
                        <View style = { styles.column }>
                            <Image
                                source = { logo }
                                style = { styles.logo } />
                        </View>
                        <View style = { styles.column }>
                            <View style = { styles.row }>
                                <Text style = { styles.title }>smash</Text>
                                <Text
                                    style = {
                                        Platform.OS === 'ios' ? styles.smallDot : styles.smallDot
                                    }>
                                    .
                                </Text>
                            </View>
                            <View style = { styles.row }>
                                <Text
                                    style = {
                                        Platform.OS === 'ios'
                                            ? styles.subtitleIos
                                            : styles.subtitleAndroid
                                    }>
                                    meet
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style = { styles.content }>
                        <View style = { styles.joinControls } >
                            <TextInput
                                accessibilityLabel = { t(roomnameAccLabel) }
                                autoCapitalize = 'none'
                                autoComplete = 'off'
                                autoCorrect = { false }
                                autoFocus = { false }
                                onBlur = { this._onFieldBlur }
                                onChangeText = { this._onRoomChange }
                                onFocus = { this._onFieldFocus }
                                onSubmitEditing = { this._onJoin }
                                placeholder = { 'Enter Link or Room Name' }
                                placeholderTextColor = {
                                    PLACEHOLDER_TEXT_COLOR
                                }
                                returnKeyType = { 'go' }
                                style = { styles.textInput }
                                underlineColorAndroid = 'transparent'
                                value = { this.state.room } />
                        </View>
                        <View style = { styles.joinControls }>
                            <LinearGradient
                                colors = { [ ColorPalette.primaryLighter, ColorPalette.primaryDark ] }
                                locations = { [ 0.2207, 0.9063 ] }
                                style = { styles.gradientContainer }>
                                <TouchableOpacity
                                    onPress = { this._onJoin }
                                    style = { styles.gradientButton }>
                                    <Text style = { Platform.OS === 'ios' ? styles.textIos : styles.textAndroid }>
                                        JOIN MEETING
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    /**
     * Renders a "reduced" version of the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderReducedUI() {
        const { t } = this.props;

        return (
            <View style = { styles.reducedUIContainer }>
                <Text style = { styles.reducedUIText }>
                    { t('welcomepage.reducedUIText', { app: getName() }) }
                </Text>
            </View>
        );
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        ..._abstractMapStateToProps(state),
        _headerStyles: ColorSchemeRegistry.get(state, 'Header')
    };
}

export default translate(connect(_mapStateToProps)(WelcomePage));
