import { Sender } from "@streammachine.io/nodejs-driver";
import { ClickstreamEvent } from "@streammachine.io/schemas-clickstream-avro";
import { randomInt } from "crypto";

const CONFIG = require("../assets/config.json");

// Copy the template credentials file, name it `credentials.json` and fill out the values
const CREDENTIALS = require("../assets/credentials.json");

const startSender = async () => {
    // Note: the schema id is hard coded in this example, in the config.json. This will be dynamically determined in a future version
    const sender = new Sender({
        ...CONFIG,
        ...CREDENTIALS
    });

    // Make sure to listen for error events, otherwise Node does not handle the error events (they're escalated)
    sender.on("error", (error) => {
        console.log("Sender", error);
    });

    await sender.connect()
        .catch(e => {
            console.error(`Connect error ${e}`, e);
        });

    setInterval(async function () {
        try {
            const r = await sender.send(createEvent(), "AVRO_BINARY");

            console.log(`Status ${r.status}`)
            if (r.status !== 204) {
                console.error(`An error occurred while sending event:`, r)
            }
        } catch (e) {
            console.error(`Error: ${e.message}`, e);
        }
    }, 100);
};

const createEvent = () => {
    const EVENT = new ClickstreamEvent();
    EVENT.abTests = ["abc"];
    EVENT.eventType = "button x clicked";
    EVENT.customer = { id: "customer-id-" }; // + Math.round(Math.random() * 1000)
    EVENT.referrer = "https://www.streammachine.io";
    EVENT.userAgent = "node-js";
    EVENT.producerSessionId = "session-id-"; // + Math.round(Math.random() * 100000)
    EVENT.conversion = 1;
    EVENT.url = "https://portal.streammachine.io/";
    EVENT.strmMeta = {
        eventContractRef: 'streammachine/clickstream/0.3.0',
        // the other fields are filled in by the Stream Machine Client
        consentLevels: [0, 1, 2]
    };
    return EVENT;
};

const EVENT = createEvent();

startSender();


