import io from "socket.io-client";
import {DEFAULT_WEBSOCKET_URL} from "../base/settings";
import {addClient} from "../profile/actions";
import {store} from '../base/app/components/BaseApp';
import {WEBSOCKET_CONNECT} from "./actionTypes";

class WebSocket {
    connect(profileId, accessToken) {
        if(this.io) {
            this.io.removeAllListeners();
            this.io.disconnect();
        }

        this.io = io(DEFAULT_WEBSOCKET_URL, {
            query: {
                token: encodeURIComponent(accessToken),
                EIO: 3,
                transport: 'websocket'
            }
        });

        this.io.on('connect', () => {
            store.dispatch(addClient(this.io.id, profileId));
        });

        this.io.on('error', (e) => {
            console.log('socket error', e);
        });

        store.dispatch({
            type: WEBSOCKET_CONNECT,
            wsConnected: true,
        });
    }

    addListener(eventName, eventHandler) {
        this.io.removeAllListeners(eventName);
        this.io.on(eventName, event => eventHandler(event));
    }

    removeAllListeners(eventName) {
        if(eventName) {
            this.io.removeAllListeners(eventName);
        } else {
            this.io.removeAllListeners();
        }
    }
}

export default new WebSocket();
