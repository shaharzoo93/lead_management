"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTConnectionHelper = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const dotenv_1 = require("dotenv");
const validationHelper_js_1 = require("../validator-helper/validationHelper.js");
const debugLogLevelEnum_js_1 = require("./constant/logging/debugLogLevelEnum.js");
const loggerHelper_js_1 = require("./logger/loggerHelper.js");
(0, dotenv_1.config)({ path: '/app/dev.env' });
const MQTT_USERNAME = process.env.INTERNAL_BROKER_USERNAME || '';
const MQTT_PASSWORD = process.env.INTERNAL_BROKER_PASSWORD || '';
const activeSubscribers = new Set();
const dataQueue = [];
let resolveNextMessage = null;
class MQTTConnectionHelper {
    static mqttClient = null;
    /**
     * Initialize the MQTT client and subscribe to topics dynamically.
     */
    static initMqttClient(brokerUrl, topics, serviceName) {
        if (!this.mqttClient) {
            // Initialize the client
            this.mqttClient = mqtt_1.default.connect(brokerUrl, {
                username: MQTT_USERNAME,
                password: MQTT_PASSWORD,
            });
            this.mqttClient.on('connect', () => {
                console.log(`Connected to MQTT broker at ${brokerUrl}`);
                this.subscribeToTopics(topics); // Initial subscription
            });
            this.mqttClient.on('message', async (receivedTopic, messageBuffer) => {
                const message = messageBuffer.toString();
                if (message && message !== '') {
                    const parsedMessage = JSON.parse(message);
                    // Validate the message
                    const [isValid, errors] = await (0, validationHelper_js_1.MQTTValidator)(receivedTopic, parsedMessage.value, parsedMessage.timestamp);
                    if (isValid) {
                        dataQueue.push({ topic: receivedTopic, message });
                        // Notify waiting generator
                        if (resolveNextMessage) {
                            resolveNextMessage();
                            resolveNextMessage = null;
                        }
                    }
                    else {
                        loggerHelper_js_1.LoggerHelper.Debug(serviceName, debugLogLevelEnum_js_1.DebugLogLevelEnum.Error, 'MQTT message is not valid', {
                            message: { topic: receivedTopic, errors, parsedMessage },
                        });
                    }
                }
            });
            this.mqttClient.on('error', (err) => {
                console.error('MQTT Client Error:', err);
            });
        }
        else {
            // Subscribe to topics dynamically if the client already exists
            this.subscribeToTopics(topics);
        }
    }
    /**
     * Subscribe to new topics, ensuring no duplicates.
     */
    static subscribeToTopics(topics) {
        const newTopics = topics.filter((topic) => !activeSubscribers.has(topic));
        if (newTopics.length > 0) {
            this.mqttClient?.subscribe(newTopics, (err, granted) => {
                if (err) {
                    console.error(`Failed to subscribe to topics:`, err);
                }
                else {
                    granted.forEach(({ topic }) => {
                        activeSubscribers.add(topic);
                    });
                }
            });
        }
    }
    /**
     * Subscribe to MQTT topics and yield messages as they are received.
     */
    static async *mqttSubscribe(brokerUrl, topics, serviceName) {
        this.initMqttClient(brokerUrl, topics, serviceName);
        try {
            while (true) {
                if (dataQueue.length > 0) {
                    yield dataQueue.shift();
                }
                else {
                    await new Promise((resolve) => {
                        resolveNextMessage = resolve;
                    });
                }
            }
        }
        finally {
            console.log('MQTT subscription generator stopped.');
        }
    }
}
exports.MQTTConnectionHelper = MQTTConnectionHelper;
