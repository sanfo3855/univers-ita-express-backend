import * as express from 'express';
import { Coupon } from './coupons.model';
import * as jwt from 'jsonwebtoken';
import { jwtSecretAdmin, jwtSecretStudents } from '../environment.dev';
import * as exjwt from 'express-jwt';

const couponsRoutes = express.Router();

const fs = require('fs');

couponsRoutes.post('/upload', exjwt({secret:jwtSecretAdmin}), async (req:express.Request, resp:express.Response, next:express.NextFunction) => {
    try{
        const codes = req.body.coupons;
        const expiration = req.body.expirationDate;
        const expirationDate =  expiration.day + "-" + expiration.month + "-" + expiration.year;
        const site = req.body.site;
        const value = req.body.value;

        for(let code of codes) {
            let coupon = new Coupon({
                code: code,
                expirationDate: expirationDate,
                site: site,
                value: value,
                given: false
            });
            await coupon.save(function (err, user) {
                if (err) return console.error(err);
                return user;
            });
        }
        resp.status(200).json({success:true,err:null});
    } catch (err) {
        resp.status(500).json({success:false,err:err.message});
        resp.end();
        console.error('Caught error', err);
    }
});

function isNextWinner(){
    let count = Number(fs.readFileSync('./count'))
    console.log(count)
    if(count === null) {
        count = 10;
    }
    if(count <= 1) {
        fs.writeFileSync('./count',String(10));
        return true;
    } else {
        fs.writeFileSync('./count', String(--count));
        return false;
    }
}

couponsRoutes.post('/imFeelingLucky', exjwt({secret:jwtSecretStudents}), async (req:express.Request, resp:express.Response, next:express.NextFunction) => {
    try {
        let isNextWinnerBool = isNextWinner();
        console.log(req.body.student);
        if (isNextWinnerBool){
            let coupon = await Coupon.findOne({given:false});
            if(coupon!==null) {
                await Coupon.updateOne({_id: coupon._id}, {$set: {given: true, student: req.body.student}});
                let response = {
                    lucky: true,
                    code: coupon['code'],
                    expire: coupon['expirationDate'],
                    site: coupon['site'],
                    value: coupon['value']
                }
                resp.status(200).json({success: true, err: null, response: response});
            } else {
                let response = {lucky: false, code: null, expire: null, site: null, value: null}
                resp.status(200).json({success: true, err: null, response: response});
            }
        } else {
            let response = {lucky: false, code: null, expire: null, site: null, value: null}
            resp.status(200).json({success:true, err:null, response:response});
        }

    } catch (err) {
        resp.status(500).json({success:false,err:err.message});
        resp.end();
        console.error('Caught error', err);
    }
});

couponsRoutes.get('/all', exjwt({secret:jwtSecretAdmin}), async (req:express.Request, resp:express.Response, next:express.NextFunction) => {
    try{
        let items: any = await Coupon.find({});
        items = items.map((item) => {
            return {
                id: item._id,
                code: item.code,
                expirationDate: item.expirationDate,
                site : item.site,
                given: item.given,
                student: item.student
            }
        });
        resp.status(200).json({success: true, err: null, response: items});
    } catch (err) {
        resp.status(500).json({success:false,err:err.message});
        resp.end();
        console.error('Caught error', err);
    }
});

couponsRoutes.get('/stats', exjwt({secret:jwtSecretAdmin}), async (req:express.Request, resp:express.Response, next:express.NextFunction) => {
    try{
        let counter = Number(fs.readFileSync('./count'))
        const response = {
            remaining: await Coupon.find({given:false}).count(),
            counter: counter
        }
        resp.status(200).json({success: true, err: null, response: response});
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

export { couponsRoutes }

