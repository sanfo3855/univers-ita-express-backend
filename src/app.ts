import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import { requestLoggerMiddleware } from './request.logger.middleware';
import { userRoutes } from './models/user.controller'
import { textSurveyRoutes } from './models/text-survey.controller'
import { couponsRoutes } from './models/coupons.controller'

process.removeAllListeners('warning')

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(requestLoggerMiddleware)
app.use('/user',userRoutes);
app.use('/text-survey',textSurveyRoutes);
app.use('/coupon',couponsRoutes);

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
textSurveyRoutes.stack.forEach((route)=>{
    console.log("  "+route.route.stack[0].method.toString().toUpperCase() + "\t/text-survey" + route.route.path );
});
couponsRoutes.stack.forEach((route)=>{
    console.log("  "+route.route.stack[0].method.toString().toUpperCase() + "\t/coupon" + route.route.path );
});

export { app }
