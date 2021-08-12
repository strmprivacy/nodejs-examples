import { Sender } from '@streammachine.io/nodejs-driver';
import { DemoEvent } from '@streammachine.io/schemas-demo-avro';

const CONFIG = require('../assets/config.json');

// Copy the template credentials file, name it `credentials.json` and fill out the values
const CREDENTIALS = require('../assets/credentials.json');

const startSender = async () => {
  // Note: the schema id is hard coded in this example, in the config.json. This will be dynamically determined in a future version
  const sender = new Sender({
    ...CONFIG,
    ...CREDENTIALS,
  });

  // Make sure to listen for error events, otherwise Node does not handle the error events (they're escalated)
  sender.on('error', (error) => {
    console.log('Sender', error);
  });

  await sender.connect().catch((e) => {
    console.error(`Connect error ${e}`, e);
  });

  setInterval(async function () {
    try {
      const r = await sender.send(createEvent(), 'AVRO_BINARY');

      console.log(`Status ${r.status}`);
      if (r.status !== 204) {
        console.error(`An error occurred while sending event:`, r);
      }
    } catch (e) {
      console.error(`Error: ${e.message}`, e);
    }
  }, 100);
};

const createEvent = () => {
  const event = new DemoEvent();
  event.strmMeta = {
    eventContractRef: 'streammachine/example/1.2.3',
    consentLevels: [0],
  };

  event.uniqueIdentifier = 'string';
  event.someSensitiveValue = 'A value that should be encrypted';
  event.consistentValue = 'a-user-session';
  event.notSensitiveValue = 'Hello from NodeJS';

  return event;
};

startSender();
