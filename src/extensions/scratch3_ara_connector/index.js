const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const BLESession = require('../../io/bleSession');
const formatMessage = require('format-message');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

//TO DO: Update to Ara Image
const blockIconURI = 'data:image/png;base64,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';

/**
 * @readonly
 * @enum {number}
 */
const BLECommand = {
    CMD_LIGHT_ON: 0x00,
    CMD_LIGHT_OFF: 0x01
};

const BLETimeout = 4500; // TODO: might need tweaking based on how long the device takes to start sending data

/**
 * @readonly
 * @enum {string}
 */
const BLEUUID = {
    //TO DO: BLESession is returning error "could not determine UUID for service"
    service: 'FFE8BADC-E1CB-46C6-9AD9-631EA7CBADFF',
    onOffChar: '00A26834-5CF4-48E5-AE1C-9E1234C03E00',
    brightnessChar: 'BBE8BADC-E1CB-46C6-9AD9-631EA7CBA2BB'
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
            filters: [
                {services: [BLEUUID.service]}
            ]
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

    /**
     * Starts reading data from device after BLE has connected to it.
     */
    _onSessionConnect () {
        this._timeoutID = window.setInterval(this.disconnectSession.bind(this), BLETimeout);
    }

    /**
     * Write a message to the device BLE session.
     * @param {number} command - the BLE command hex.
     * @param {Uint8Array} message - the message to write.
     * @return {Promise} - a Promise that resolves when writing to device.
     * @private
     */
    _writeSessionData (command, message) {
        if (!this.getPeripheralIsConnected()) return;
        return this._ble.write(service, command, message);
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
     * @return {array} - text and values for each tilt direction menu element
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
                    description: 'label for on element in light state picker for araConnector extension'
                }),
                value: onOffIndicator.OFF
            },
        ];
    }

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
                    opcode: 'flipSwitch',
                    text: formatMessage({
                        id: 'araConnector.flipSwitch',
                        default: 'flip switch to [BTN]?',
                        description: 'is the Ara light on or off?'
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
                        default: 'set brightness to [BTN]?',
                        description: 'how bright is the Ara lamp?'
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
            ],
            menus: {
                lightState: this.ON_OFF_MENU,
                brightness: this.BRIGHTNESS_MENU
            }
        };
    }

    /**
     * @param {string} text - the text to display.
     * @return {Promise} - a Promise that resolves when writing to device.
     */
    flipSwitch (args) {
        if (args.BTN == 'off') {
            this._ble._writeSessionData(service, onOffChar, 0x00);
        } else {
            this._ble._writeSessionData(service, onOffChar, 0x01);
        }
    }

    setLightBrightness(args){
        if(args.BTN == 'bright') {
            this.ble._writeSessionData(service, brightnessChar, 0x00);
        } else if (args.BTN == 'medium') {
            this.ble._writeSessionData(service, brightnessChar, 0x32);
        } else {
            this.ble._writeSessionData(service, brightnessChar, 0x64);
        } 
    }
}

module.exports = Scratch3AraConnectorBlocks;
