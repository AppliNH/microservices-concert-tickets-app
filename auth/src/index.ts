import {connect} from 'mongoose';
import {app} from './app';


// startup script
const start = async() => {

    if (!process.env.JWT_KEY) {
        throw new Error("No JWT key provided. Use JWT_KEY as key, as env variable.");
    }

    try {
        await connect('mongodb://auth-mongo-service:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch(err) {
        console.error(err);
    }

    console.log("Conencted to auth-mongo !")

    app.listen(3000, () => {
        console.log("Listenin' on port 3000");
    });

};

start();