// @flow

import { NativeModules } from 'react-native';

import { loadScript } from '../util';
import logger from './logger';

export * from './functions.any';

const { JavaScriptSandbox } = NativeModules;

/**
 * Loads config.js from a specific remote server.
 *
 * @param {string} url - The URL to load.
 * @returns {Promise<Object>}
 */
export async function loadConfig(url, env): Promise<Object> {
    try {

        const configTxt = env + "\n" + await loadScript(url, 2.5 * 1000, true);
        const configJson = await JavaScriptSandbox.evaluate(`${configTxt}\nJSON.stringify(config);`);
        const config = JSON.parse(configJson);

        if (typeof config !== 'object') {
            throw new Error('config is not an object');
        }

        logger.info(`Config loaded from ${url}`);

        return config;
    } catch (err) {
        logger.error(`Failed to load config from ${url}`, err);

        throw err;
    }
}

export async function loadEnv(url){
    try {

        return await loadScript(url, 2.5 * 1000, true);
    } catch (err) {
        logger.error(`Failed to load config from ${url}`, err);

        throw err;
    }
}