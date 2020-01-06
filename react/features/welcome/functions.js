// @flow

import { WELCOME_PAGE_ENABLED, getFeatureFlag } from '../base/flags';
import { toState } from '../base/redux';

declare var APP: Object;

/**
 * Determines whether the {@code WelcomePage} is enabled by the app itself
 * (e.g. Programmatically via the Jitsi Meet SDK for Android and iOS). Not to be
 * confused with {@link isWelcomePageUserEnabled}.
 *
 * @param {Function|Object} stateful - The redux state or {@link getState}
 * function.
 * @returns {boolean} If the {@code WelcomePage} is enabled by the app, then
 * {@code true}; otherwise, {@code false}.
 */
export function isWelcomePageAppEnabled(stateful: Function | Object) {
    if (navigator.product === 'ReactNative') {
        // We introduced the welcomePageEnabled prop on App in Jitsi Meet SDK
        // for Android and iOS. There isn't a strong reason not to introduce it
        // on Web but there're a few considerations to be taken before I go
        // there among which:
        // - Enabling/disabling the Welcome page on Web historically
        // automatically redirects to a random room and that does not make sense
        // on mobile (right now).
        return Boolean(getFeatureFlag(stateful, WELCOME_PAGE_ENABLED));
    }

    return true;
}

/**
 * Determines whether the {@code WelcomePage} is enabled by the user either
 * herself or through her deployment config(uration). Not to be confused with
 * {@link isWelcomePageAppEnabled}.
 *
 * @param {Function|Object} stateful - The redux state or {@link getState}
 * function.
 * @returns {boolean} If the {@code WelcomePage} is enabled by the user, then
 * {@code true}; otherwise, {@code false}.
 */
export function isWelcomePageUserEnabled(stateful: Function | Object) {
    return (
        typeof APP === 'undefined'
            ? true
            : toState(stateful)['features/base/config'].enableWelcomePage);
}

export async function generateKeys() {
    const encryptAlgorithm = {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
        modulusLength: 4096,
        extractable: false,
        publicExponent: new Uint8Array([1, 0, 1])
    };
    const scopeEncrypt = ['encrypt', 'decrypt'];

    return await crypto.subtle.generateKey(encryptAlgorithm, true, scopeEncrypt);
}

export function exportPublic(publicKey) {
    return new Promise((resolve) => {
        crypto.subtle.exportKey('spki', publicKey).then((spki) => {
            resolve(convertBinaryToPem(spki, 'RSA PUBLIC KEY'));
        });
    });
}

export function exportPrivate(privateKey): Promise<string> {
    return new Promise(resolve => {
        crypto.subtle.exportKey('pkcs8', privateKey).then(pkcs8 => {
            resolve(convertBinaryToPem(pkcs8, 'RSA PRIVATE KEY'));
        });
    });
}

export function convertBinaryToPem(binaryData, label) {
    const base64Cert = arrayBufferToBase64String(binaryData);
    let pemCert = '-----BEGIN ' + label + '-----\r\n';
    let nextIndex = 0;
    while (nextIndex < base64Cert.length) {
        if (nextIndex + 64 <= base64Cert.length) {
            pemCert += base64Cert.substr(nextIndex, 64) + '\r\n';
        } else {
            pemCert += base64Cert.substr(nextIndex) + '\r\n';
        }
        nextIndex += 64;
    }
    pemCert += '-----END ' + label + '-----\r\n';
    return pemCert;
}

export function arrayBufferToBase64String(arrayBuffer) {
    const byteArray = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    return btoa(byteString);
}

export function convertPemToBinary(pem) {
    const lines = pem.split('\n');
    let encoded = '';
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().length > 0 &&
            lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
            lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
            lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
            encoded += lines[i].trim();
        }
    }
    return this.base64StringToArrayBuffer(encoded);
}

export function base64StringToArrayBuffer(b64str) {
    const byteStr = atob(b64str);
    const bytes = new Uint8Array(byteStr.length);
    for (let i = 0; i < byteStr.length; i++) {
        bytes[i] = byteStr.charCodeAt(i);
    }
    return bytes.buffer;
}
