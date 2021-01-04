import {MongoMemoryServer} from 'mongodb-memory-server'; // Keep various mongodb instances in memory that you can later reuse
import mongoose from 'mongoose';
import {app} from '../app';


let mongo: any;

// Runs before everything starts
beforeAll(async() => {
    process.env.JWT_KEY = "jwtkeyisboss"; // Needed to sign the JWT

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

});

// Runs before each test starts
beforeEach(async() => {
    // get all collections
    const collections = await mongoose.connection.db.collections();

    // delete all collections
    for (let collection of collections) {
        await collection.deleteMany({});
    }

});


afterAll(async() => {
    await mongo.stop();
    await mongoose.connection.close();
});