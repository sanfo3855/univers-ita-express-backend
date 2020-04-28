import { app } from './app';
import * as http from 'http';
import * as mongoose from 'mongoose';

const port = 3000;
const server = http.createServer(app);
const MONGO_URI = 'mongodb://localhost:27017/univers-ita';

server.listen(port);
server.on('error', (err)=>{
    console.log(err);
});

server.on('listening', ()=>{
    console.info(`Listening on port ${port}`);
    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', () => {
        console.info('Connected to Mongo via Mongoose');
    });
    mongoose.connection.on('error', (err) => {
        console.error('Unable to connect to Mongo via Mongoose', err)
    });
});