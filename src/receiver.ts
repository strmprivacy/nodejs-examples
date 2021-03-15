import {Receiver} from "@streammachine.io/nodejs-driver";

const CONFIG = require("../assets/config.json");
const CREDENTIALS = require("../assets/credentials.json");

async function startReceiver() {
    const receiver = new Receiver({
        ...CREDENTIALS,
        ...CONFIG
    });

    receiver.on("event", (event) => {
        console.log(JSON.stringify(event));
    });

    receiver.on("error", (error) => {
        console.log("Receiver", error.message);
    });

    try {
        await receiver.connect();
    } catch (error) {
        console.log("Connect failed", error);
    }
}

startReceiver();
