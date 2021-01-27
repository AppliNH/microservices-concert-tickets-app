import nats, {Stan} from 'node-nats-streaming';

// Singleton (no constructor)
// Allows to instantiate a NATS SS client
class NatsWrapper {
    private _client?: Stan;

    get client() {
        if(!this._client) {
            throw new Error("Cannot access NATS client before connecting to a NATS Streaming Server");
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        
        this._client = nats.connect(clusterId, clientId, {url});

        return new Promise<void>((resolve, reject) => {
            this.client.on("connect", () => {
                console.log("Connected to NATS SS");
                resolve();
            });

            this.client.on('error', (err) => {
                reject(err);
            })
        });
        

    }

   
}

export const natsWrapper = new NatsWrapper();