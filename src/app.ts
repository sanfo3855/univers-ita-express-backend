import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import { requestLoggerMiddleware } from './request.logger.middleware';
import { userRoutes } from './models/user.controller'

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(requestLoggerMiddleware)
app.use('/user',userRoutes);

//JWT Error Handling
app.use(function (err:express.ErrorRequestHandler, req:express.Request, resp:express.Response, next:express.NextFunction) {
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        resp.status(401).send(err);
    }
    else {
        next(err);
    }
});

//Print hooked routes
console.log('Exposed API Routes:')
userRoutes.stack.forEach((route)=>{
    console.log("  "+route.route.stack[0].method.toString().toUpperCase() + "\t/user" + route.route.path );
});
console.log();

export { app }
