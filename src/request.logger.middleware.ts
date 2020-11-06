import * as express from 'express';

const requestLoggerMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) =>{
    const _ = require('lodash');
    const datetime = new Date().toString()
    console.info(`\n${datetime}`);
    console.info (`${req.method} ${req.originalUrl}`);
    const request = _.cloneDeep(req);
    if(request.body.password){
        request.body.password = "********"
    }
    if(request.body.questions){
        request.body.questions = JSON.stringify(request.body.questions);
    }
    console.info(request.body);
    
    const start = new Date().getTime();
    res.on('finish', () => {
        const elapsed = new Date().getTime() - start;
        console.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms`);
        console.info("============================================\n")
    })
    next();
}

export { requestLoggerMiddleware };