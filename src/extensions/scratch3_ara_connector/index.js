const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const BLESession = require('../../io/bleSession');
const formatMessage = require('format-message');
const Base64Util = require('../../util/base64-util');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

//TO DO: Update to Ara Image
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAKcElEQVR42u2cfXAU9RnHv7u3L3d7l9yR5PIGXO7MkQKaYiCUWqJhFGvRMk4JZXSc8aXVaSmiYlthVHQEW99FxiIdrVY6teiMdoa+ICqhIqgQAsjwMgYDOQKXl7uY17u9293b3f5x5JKYe8+FJGSfvzbP/n77e/azz+95nt9v90KoqgpN0hdSQ6AB1ABqADWAmmgANYAaQA2gJhpADeBEE2q8GPLaWzu/CslyiY4k9dOn5uijtXGd7+jWkaReVpT3Hrhv6d0awEFC07rgD+ZeYYnXprhwigUAvjj0zbjxQCLebozT7iDzK1ZUWCru2K7L//6MVC8ue45Blz8n6rlQ815QtuohOlXiEdy/AUqPa6y59Mkh6Q1345GNja6m7pHEQKNl3t0704EXat4L6fSOmOeEI1vHKzwAyNJR9MPFpRUPOu0ONm2A0xatWaTLm5WfDrzvAppA8AbiG03fC8CQNkDKZK2YrPAuRrhpifJERsuYywveJc7CqcIDMAyeLm82dEXzw39I/qjXkpr3QuW9lxfAdOABGAKPslWDnbsy7Jl8BxTeM3SqmO0gaA5U6c3jymup0YSn9JyLee67wpTfBQAQjmyF3HFqiJcRtDECjy5dAmbmcgQPvjjxl3Lx4IVjnD/5cE1zkWtyP34VBGcdKLJnLgc9cznk1kMXFdzEn8KJ4KUqqsSHvcxWDf7j1UM8UPr6/YgHhhX8xAaYaXgAIB7fBnbuSrBzV8aNgarEQ/z6/YkLcDTg9V9XlXjQtuqoU1TpcUHlvZDOfDiuyh5qPMCLrJ1bDw3EuUtx81N/BH3pjQBJQ2HMF5V6iKfeRchVm9kkMtrwxmSdobeA9daBde8GwVlBcFYofS1Jw0vaAy9HeJHQwBUPzIBvGxDc92Rmp/BowJs10wkAONfsBs8HAAAltqngOAO8HZ3o6OiMqcvLy4E1Lwc8H8C5ZndMXdLJa/qNacNLCDBw/O8nFUNWxp/64+tWAwBefe1tHKg7CgC4/9d3ori4EHv3HcDrb26PqVt2602ovvaHaGlpw+8ffSamLqXYmya8jG8mpFy6iGLkWLh4HAwG4+r6j4VBfaPpLgU8IMGO9MLqW2pYQ9aQokuR5dgXIwCC1CUcNMj3hpdvLAdSF54EYpCHooRA0Swomo2pC0kCQpIAkqTA6LmYupgxL0X7m78+aG10NXVkpIwxsAwWXncDCESHLkohfPbpbiT6ZFPPZQ9fC0e58Wi6wTDj6UbT/rQAyiERS2pW4Kc3LQDLRO8miCEAKj7d83FcTxyLJJJJ+9MCqKoq9HomMrgkSThxsgEcZ8AMpwMkSYJlKDA0DVUFiHGWRDJp/4jXwqIo4uFHnkZXdw8AYGbZFXhs3WqQJDkhkkim7E8KoMlkxKbnn8DBunrwUli3e8/+yOAA0HjmHDq7upGXm5PUoDUr7hmWRB5Zt3FYwoime+vtd/H6G9uGJIxouniSyP6H7v8FystnY80jGzIA0MihsMAKu20aTp3JzFb6WCWRuDUvHwByw8cOhw2FBVaYjNzIAba1e3Hfb9aiq7MTNStuBwAsvr4KO3d9GnmKztIS5EyxTJiVSDT7p04tipx/9MnnYc7ORlu7NzMxsK3di5AkDHgGw2DTC+uHBeGJshJJZL/fxyMQEDKbRAiCQDAoQhBDYBkKNE2j4uqrhpUBoiSBIMZfEhkN+1NeiWSqEB2rlUg69md0JRIQRHy86z8jXsqNVRLJlP0jqgNJXXgAgjbCcONmCHUvQ+44NWG2s/rtH5Mt/ciToo0wLH4JBGO6LLazRiJk2vBYy4gHHw/bWSN+LZBKEhkMjzn/CaSiKgQOvJDyFB7L7axUJWNJZDA8IhQA1boPin7KZbMSGfUYyFx9b3hXg/cCsoBA2Z0AoYOaxlcC4+mdyCUDKBzanLFBJ3USyaRMuiSSKZmUSSSTMimTCABUlblRU9kAZ0E39p+eii21c+EL0jHbOwu6sfaWgyjND//U4oP6MmzZnfi79XT7mfQSNi7bh0JzOLG19XBY/89r49pYVebGqhuOosDsh1+gsWV3BXYdd2Q+BlaVuXFv9bHgkSbzk+vfcVRyjHhi47J9cftsXLYf7T36Ix8cLHlo6ydlv6qpPI2qssRZcuOy/Wjp4k5s+2zG+offKqtcUt6kJtNv7S0H0RtkvEufXTB/6bML5je2Wy7UVDbEbF9o9mPDsv2oP5v75vbPS26rP5u3fdXiozDppcwDrKlswOlWy9E//DX09Mt/azh8zzNM1RybF86C7pheVGD240CDeX3NWtfml94Rt+0+Mf3Lm8qbEnpfgdmPs+3G9+564vTT//pM/GrHYduWRP0AYOEMN/5S61xT92Vtfd2XtfWb/vu91fHALyxzw9tnkB/cTD5w+2Ou9375HHtfa7exM5mxRpKFaafdQQKgAcDERs98/foLHrXdaXfoABi8vczhWO2/28/TRR5z2h00gKymNl1ton79oigq6bQ7dE67Q+ew9mb1h4FYYwVESgLAXLSRa+3mWpIdK+UYuPiq89f8+XfT/+ftZQ4vLm9ZmUyfdcsv1M2fWfRaUCK8i8vdK1u6ktuAWPWTsztm24o/cnnYHUsrWzd1+fVJ9XtqxbG3XzFdNcPTawjcueibpxK1t+X26f/9R8a953jub4typOvm2b1XnvUmv8JKWMZcaZffX3XDERRP8cGaFRjWxtPLoZvXY4oxgPBNEsgxBhCUKEzL6Ru+JydS8Ak0giKFgESDJFQoKmCgQzAwIfQEWETzmoBIwd2VNaStu8uEHGO4Buz06zHHFv0dRkefAZ1+PQx0KNK2eIoPLCUj2zDc275qzgcBFWv+cf3IyxgTK2KOzQufEM5kfpGF12eGPSf8DXN+No/87HDWiwYYALw+M6ym8AscAxO++X7xCTRM7EDQzht0Da8v/NWo1dQDAxNCocUXs+303IGHdaptOmYXnh/SLlZbV+fwnwJm6UXEm/ojqgM/PFmJQ81OPHfrtqT7bN23BE8seTflYLvz5DwYGQHLKz5Puo/XZ8aLtT+D1dSDuxbsGQIymmz48DbwIguOESJOcce8XaO3oVpZ8k3Em5KVVAAMFnuOB9as1MbimCBunn04vBmR40ls29Wfgxf1KMn1gBdY+MXUCvK4ANvPndpLzrLzALjBN2VPwrDBksgLYkn1jBMp90nVY2++8vAw3RlPeLNYVZSPAEgjKWP6ZCn4lF+gMdnE08spQb73RQB9aXtgo6tJcNodf8rWz3L//Br340UW3sExEkXrFFKSSUVHqkRfkJZ8QSZk5gS6hw9H+GyDQAclSs41BVmSUIn+toAKIUTJskKoQUknCxKlkISKb/sM0NMyyVAhXW+AlYosfgOgQlUJVadTSUWBKoQoudvPioPbenq5oIUTaRUqenhWKi3oyVIUqKpKREoLggDhF6hQb4CV9LRM9rctMPN6glChp2SdTqeSskwoAECSKnG61fzFR/XsGu+FhmONriYl7TImsjoYKJyZSeB8CoBQo6spqU8TCO1fgE7gDVUNoCYaQA2gBlADqAHURAOoAdQAagA10QCOgfwfNp/hXbfBMCAAAAAASUVORK5CYII=';

/**
 * @readonly
 * @enum {number}
 */
const BLECommand = {
    CMD_LIGHT_ON: 0x01,
    CMD_LIGHT_OFF: 0x00,
    CMD_BRIGHTNESS_DULL: 0x05,
    CMD_BRIGHTNESS_MEDIUM: 0x10,
    CMD_BRIGHTNESS_BRIGHT: 0x64,
    CMD_TEMPERATURE_COOL: 0x64,
    CMD_TEMPERATURE_NEUTRAL: 0x32,
    CMD_TEMPERATURE_WARM: 0x00
};

const BLETimeout = 4500; // TODO: might need tweaking based on how long the device takes to start sending data

/**
 * @readonly
 * @enum {string}
 */
const BLEUUID = {
    //TO DO: BLESession is returning error "could not determine UUID for service"
    service: 'dd649f02-14fe-11e5-b60b-1697f925ecdd',
    lightingService: "ffe8badc-e1cb-46c6-9ad9-631ea7cbadff",
    onOffChar: '00a26834-5cf4-48e5-ae1c-9e1234c03e00',
    brightnessChar: 'bbe8badc-e1cb-46c6-9ad9-631ea7cba2bb',
    temperatureChar: 'cce8badc-e1cb-46c6-9ad9-631ea7cba2cc'
};

/**
 * Manage communication with a Ara device over a Scrath Link client socket.
 */
class AraConnector {

    /**
     * Construct a Ara communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        /**
         * The BluetoothLowEnergy connection session for reading/writing device data.
         * @type {BLESession}
         * @private
         */
        this._ble = null;
        this._runtime.registerExtensionDevice(extensionId, this);

        /**
         * The most recently received value for each sensor.
         * @type {Object.<string, number>}
         * @private
         */

        this._sensors = {
            lightState: 'off',
            brightnessState: 'bright',
            temperatureState: 'neutral'
        };

        /**
         * A flag that is true while we are busy sending data to the BLE session.
         * @type {boolean}
         * @private
         */
        this._busy = false; 

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;

        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;
    }

    // TODO: keep here?
    /**
     * Called by the runtime when user wants to scan for a device.
     */
    startDeviceScan () {
        this._ble = new BLESession(this._runtime, {
            filters: [{services: [BLEUUID.lightingService]}],
            optionalServices: [BLEUUID.service]
        }, this._onSessionConnect.bind(this));
    }
    

    // TODO: keep here?
    /**
     * Called by the runtime when user wants to connect to a certain device.
     * @param {number} id - the id of the device to connect to.
     */
    connectDevice (id) {
        this._ble.connectDevice(id);
    }

    disconnectSession () {
        window.clearInterval(this._timeoutID);
        this._ble.disconnectSession();
    }

    getPeripheralIsConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.getPeripheralIsConnected();
        }
        return connected;
    }

    setLightState (lightState) {
        this._sensors.lightState = lightState;
    }

    setBrightnessState (brightnessState) {
        this._sensors.brightnessState = brightnessState;
    }

    setTemperatureState(tempState) {
        this._sensors.temperatureState = tempState;
    }

    /**
     * @return {text} - the latest value received for the light state sensor.
     */
    get lightState() {
        return this._sensors.lightState;
    }

    /**
     * @return {text} - the latest value received for the brightness state sensor.
     */
    get brightnessState() {
        return this._sensors.brightnessState;
    }

     /**
     * @return {text} - the latest value received for the temperature state sensor.
     */
    get temperatureState() {
        return this._sensors.temperatureState;
    }

    /**
     * Starts reading data from device after BLE has connected to it.
     */
    _onSessionConnect () {
        const onOffCallback = this._processOnOffData.bind(this);
        const brightnessCallback = this._processBrightnessData.bind(this);
        //const tempCallback = this._processTemperatureData.bind(this);
        this._ble.read(BLEUUID.lightingService, BLEUUID.onOffChar, true, onOffCallback);
        this._busyTimeoutID = window.setTimeout(() => {
            this._ble.read(BLEUUID.lightingService, BLEUUID.brightnessChar, true, brightnessCallback);
        }, 500);
        // this._busyTimeoutID = window.setTimeout(() => {
        //     this._ble.read(BLEUUID.lightingService, BLEUUID.temperatureChar, true, tempCallback);
        // }, 500);
        //this._timeoutID = window.setInterval(this.disconnectSession.bind(this), BLETimeout);
    }

    /**
     * Process the on/off sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _processOnOffData (lightState) {
        const data = Base64Util.base64ToUint8Array(lightState);
        if (data == 1) {
            this._sensors.lightState = 'on';
        } else {
            this._sensors.lightState = 'off';
        }
        window.clearInterval(this._timeoutID);
    }

    /**
     * Process the brightness sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _processBrightnessData (brightnessState) {
        const data = Base64Util.base64ToUint8Array(brightnessState);
        if (data == 100) {
            this._sensors.brightnessState = 'bright';
        } else if (data == 50){
            this._sensors.brightnessState = 'medium';
        } else {
            this._sensors.brightnessState = 'dull';
        }
        window.clearInterval(this._timeoutID);
        }

    /**
     * Process the temperature sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _processTemperatureData (temperatureState) {
        const data = Base64Util.base64ToUint8Array(temperatureState);
        if (data == 100) {
            this._sensors.temperatureState = 'warm';
        } else if (data == 50) {
            this._sensors.temperatureState = 'neutral';
        } else {
            this._sensors.temperatureState = 'cool';
        }
        window.clearInterval(this._timeoutID);
    }

    /**
     * Write a message to the device BLE session.
     * @param {number} command - the BLE command hex.
     * @param {Uint8Array} message - the message to write.
     * @return {Promise} - a Promise that resolves when writing to device.
     * @private
     */
    _writeSessionData (characteristicId, command) {
        if (!this.getPeripheralIsConnected()) return;

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the device was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);
    
        const output = new Uint8Array(1);
        output[0] = command;
        const data = Base64Util.uint8ArrayToBase64(output);
        return this._ble.write(BLEUUID.lightingService, characteristicId, data, "base64", true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        )
    }
}

/**
 * * Enum for on / off indicator.
* @readonly
* @enum {string}
*/
const onOffIndicator = {
    ON: 'on',
    OFF: 'off'
};

/**
 * * Enum for brightness indicator.
* @readonly
* @enum {string}
*/
const brightnessIndicator = {
    DULL: 'dull',
    MEDIUM: 'medium',
    BRIGHT: 'bright'
};

/**
 * * Enum for temperature indicator.
* @readonly
* @enum {string}
*/
const temperatureIndicator = {
    COOL: 'cool',
    NEUTRAL: 'neutral',
    WARM: 'warm'
};

/**
 * Scratch 3.0 blocks to interact with a Ara device.
 */
class Scratch3AraConnectorBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'araConnector';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'araConnector';
    }

    /**
     * @return {array} - text and values for each on/off menu element
     */
    get ON_OFF_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'araConnector.onOffMenu.on',
                    default: 'on',
                    description: 'label for on element in light state picker for araConnector extension'
                }),
                value: onOffIndicator.ON
            },
            {
                text: formatMessage({
                    id: 'araConnector.onOffMenu.off',
                    default: 'off',
                    description: 'label for off element in light state picker for araConnector extension'
                }),
                value: onOffIndicator.OFF
            },
        ];
    }
    
    /**
     * @return {array} - text and values for each brightness menu element
     */
    get BRIGHTNESS_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'araConnector.brightnessMenu.dull',
                    default: 'dull',
                    description: 'label for dull element in brightness state picker for araConnector extension'
                }), 
                value: brightnessIndicator.DULL
            }, 
            {
                text: formatMessage({
                    id: 'araConnector.brightnessMenu.medium',
                    default: 'medium',
                    description: 'label for medium element in brightness state picker for araConnector extension'
                }),
                value: brightnessIndicator.MEDIUM
            }, 
            {
                text: formatMessage({
                    id: 'araConnector.brightnessMenu.bright',
                    default: 'bright',
                    description: 'label for bright element in brightness state picker for araConnector extension'
                }),
                value: brightnessIndicator.BRIGHT
            }
        ]
    }

    /**
     * @return {array} - text and values for each temperature menu element
     */
    get COLOR_TEMP_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'araConnector.colorTemperature.cool',
                    default: 'cool',
                    description: 'label for cool element in temperature state picker for araConnector extension'
                }), 
                value: temperatureIndicator.COOL
            }, 
            {
                text: formatMessage({
                    id: 'araConnector.colorTemperature.neutral',
                    default: 'neutral',
                    description: 'label for neutral element in temperature state picker for araConnector extension'
                }),
                value: temperatureIndicator.NEUTRAL
            }, 
            {
                text: formatMessage({
                    id: 'araConnector.colorTemperature.warm',
                    default: 'warm',
                    description: 'label for warm element in temperature state picker for araConnector extension'
                }),
                value: temperatureIndicator.WARM
            }
        ]
    }

    /**
     * @return {array} - text and values for each light flash menu element
     */
    get FLASH_LIGHTS_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'araConnector.flashLights.5',
                    default: '5',
                    description: 'label for on element in flash lights picker for araConnector extension'
                }),
            },
            {
                text: formatMessage({
                    id: 'araConnector.flashLights.10',
                    default: '10',
                    description: 'label for on element in flash lights picker for araConnector extension'
                }),
            },
            {
                text: formatMessage({
                    id: 'araConnector.flashLights.20',
                    default: '20',
                    description: 'label for on element in flash lights picker for araConnector extension'
                }),
            },
        ];
    }

    /**
     * Construct a set of Ara blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new Ara device instance
        this._device = new AraConnector(this.runtime, Scratch3AraConnectorBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3AraConnectorBlocks.EXTENSION_ID,
            name: Scratch3AraConnectorBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'whenSwitchFlipped',
                    text: formatMessage({
                        id: 'araConnector.whenSwitchFlipped',
                        default: 'when light switched [BTN]',
                        description: 'when the light flip is switched'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'lightState',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'whenBrightnessChanged',
                    text: formatMessage({
                        id: 'araConnector.whenBrightnessChanged',
                        default: 'when brigthness is [BTN]',
                        description: 'when the light brightness is switched'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'brightness',
                            defaultValue: 'bright'
                        }
                    }
                },
                {
                    opcode: 'whenColorTemperatureChanged',
                    text: formatMessage({
                        id: 'araConnector.whenColorTemperatureChanged',
                        default: 'when temperature is [BTN]',
                        description: 'when the light temperature is switched'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'colorTemperature',
                            defaultValue: 'warm'
                        }
                    }
                },
                '---',
                {
                    opcode: 'flipSwitch',
                    text: formatMessage({
                        id: 'araConnector.flipSwitch',
                        default: 'turn light [BTN]',
                        description: 'set the Ara light to on or off'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'lightState',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'setLightBrightness',
                    text: formatMessage({
                        id: 'araConnector.setLightBrightness',
                        default: 'set brightness to [BTN]',
                        description: 'set the brightness of the Ara lamp'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'brightness',
                            defaultValue: 'bright'
                        }
                    }
                },
                {
                    opcode: 'setColorTemperature',
                    text: formatMessage({
                        id: 'araConnector.setColorTemperature',
                        default: 'set temperature to [BTN]',
                        description: 'set the color temperature of the Ara lamp'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'colorTemperature',
                            defaultValue: 'warm'
                        }
                    }
                },
                {
                    opcode: 'flashLights',
                    text: formatMessage({
                        id: 'araConnector.flashLights',
                        default: 'flash lights [BTN] times',
                        description: 'flash the light a number of times'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'flashLights',
                            defaultValue: '5'
                        }
                    }
                },
                '---',
                {
                    opcode: 'lightState',
                    text: formatMessage({
                        id: 'araConnector.lightState',
                        default: 'light is [BTN]',
                        description: 'whether the Ara light is on or off'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'lightState',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'brightnessState',
                    text: formatMessage({
                        id: 'araConnector.brightnessState',
                        default: 'brightness is [BTN]',
                        description: 'whether the Ara light is bright, neutral, or dull'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'brightness',
                            defaultValue: 'bright'
                        }
                    }
                },
                {
                    opcode: 'temperatureState',
                    text: formatMessage({
                        id: 'araConnector.temperatureState',
                        default: 'temperature is [BTN]',
                        description: 'whether the Ara light is warm, neutral, or cool'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'colorTemperature',
                            defaultValue: 'warm'
                        }
                    }
                },
            ],
            menus: {
                lightState: this.ON_OFF_MENU,
                brightness: this.BRIGHTNESS_MENU,
                flashLights: this.FLASH_LIGHTS_MENU,
                colorTemperature: this.COLOR_TEMP_MENU
            }
        };
    }

    /**
     * Test whether the switch is flipped
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the switch state matches input state.
     */
    whenSwitchFlipped (args) {
        if (args.BTN == this._device.lightState) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Test the light's brightness
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the switch state matches input state.
     */
    whenBrightnessChanged (args) {
        if (args.BTN == this._device.brightnessState) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Test the light's temperature
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the switch state matches input state.
     */
    whenColorTemperatureChanged (args) {
        if (args.BTN == this._device.temperatureState) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {Object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    flipSwitch (args) {
        if (args.BTN == 'off') {
            this._device._writeSessionData(BLEUUID.onOffChar, BLECommand.CMD_LIGHT_OFF);
            this._device.setLightState('off');
        } else {
            this._device._writeSessionData(BLEUUID.onOffChar, BLECommand.CMD_LIGHT_ON);
            this._device.setLightState('on');
        }
    }

    /**
     * @param {Object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    setLightBrightness(args){
        if(args.BTN == 'bright') {
            this._device._writeSessionData(BLEUUID.brightnessChar, BLECommand.CMD_BRIGHTNESS_BRIGHT);
            this._device.setBrightnessState('bright');
        } else if (args.BTN == 'medium') {
            this._device._writeSessionData(BLEUUID.brightnessChar, BLECommand.CMD_BRIGHTNESS_MEDIUM);
            this._device.setBrightnessState('medium');
        } else {
            this._device._writeSessionData(BLEUUID.brightnessChar, BLECommand.CMD_BRIGHTNESS_DULL);
            this._device.setBrightnessState('dull');
        } 
    }

    /**
     * @param {Object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    setColorTemperature(args){
        if(args.BTN == 'cool') {
            this._device._writeSessionData(BLEUUID.temperatureChar, BLECommand.CMD_TEMPERATURE_COOL);
            this._device.setTemperatureState('cool');
        } else if (args.BTN == 'neutral') {
            this._device._writeSessionData(BLEUUID.temperatureChar, BLECommand.CMD_TEMPERATURE_NEUTRAL);
            this._device.setTemperatureState('neutral');
        } else {
            this._device._writeSessionData(BLEUUID.temperatureChar, BLECommand.CMD_TEMPERATURE_WARM);
            this._device.setTemperatureState('warm');
        } 
    }

    /**
     * @param {Object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    flashLights (args) {
        var i;
        for (i = 0; i < parseInt(args.BTN); i++) {
            this._device._writeSessionData(BLEUUID.onOffChar, BLECommand.CMD_LIGHT_OFF);
            this._device._writeSessionData(BLEUUID.onOffChar, BLECommand.CMD_LIGHT_ON);
            this._device.setLightState('on');
        }
    }

    /**
     * Test whether the on/off sensor is currently on or off.
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the on/off sensor matches input.
     */
    lightState(args) {
        if (this._device.lightState == args.BTN) {
            return true;
        } else {
            return false;
        }
        }

    /**
     * Test whether the brightness sensor is currently bright, medium or dull.
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the brightness sensor matches input.
     */
    brightnessState(args) {
        if(this._device.brightnessState == args.BTN) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Test whether the temperature sensor is currently warm, neutral, or cool.
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if the temperature sensor matches input.
     */
    temperatureState(args) {
        if(this._device.temperatureState == args.BTN) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Scratch3AraConnectorBlocks;