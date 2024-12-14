import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const node_env = process.env.NODE_ENV;

const options = {
    minPoolSize: 5,
    maxPoolSize: 20,
};

let client;
let clientPromise;

if (!uri) {
    throw new Error("Bitte definiere die MONGODB_URI Umgebungsvariable");
}

if (node_env === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;