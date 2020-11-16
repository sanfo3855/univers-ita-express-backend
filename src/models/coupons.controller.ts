import * as express from 'express';
import { Coupon, CouponCounter } from './coupons.model';
import * as jwt from 'jsonwebtoken';
import { jwtSecretAdmin, jwtSecretStudents } from '../environment.dev';
import * as exjwt from 'express-jwt';
import {User} from "./user.model";

const couponsRoutes = express.Router();

let nextWinner = 10;

couponsRoutes.post('/upload', exjwt({secret:jwtSecretAdmin}), async (req:express.Request, resp:express.Response, next:express.NextFunction) => {
    try{
        const codes = req.body.coupons;
        const expiration = req.body.expirationDate;
        const expirationDate =  expiration.day + "-" + expiration.month + "-" + expiration.year;
        const site = req.body.site;

        for(let code of codes) {
            let coupon = new Coupon({
                code: code,
                expirationDate: expirationDate,
                site: site,
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

async function isNextWinner(){
    let counter = await CouponCounter.findOne({});
    if(counter === null) {
        let coupCounter = new CouponCounter({counter:10})
        counter = await coupCounter.save(function (err, counter) {
            if (err) return console.error(err);
            return counter;
        });
    } else {
        if(counter[0].counter === 0) {

            return true;
        } else {
            return false;
        }

    }
}

couponsRoutes.get('/imFeelingLucky', exjwt({secret:jwtSecretStudents}), async (req:express.Request, resp:express.Response, next:express.NextFunction) => {
    try {
        //let isNextWinnerBool = await isNextWinner();
        //console.log(nextWinner);

        resp.status(200).json({success:true, err:null, response:{lucky: false, code: null, expire: 1}});
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
        resp.json({success: true, err: null, response: items});
    } catch (err) {
        resp.status(500).json({success:false,err:err.message});
        resp.end();
        console.error('Caught error', err);
    }
});

couponsRoutes.get('/stats', exjwt({secret:jwtSecretAdmin}), async (req:express.Request, resp:express.Response, next:express.NextFunction) => {
    try{
        let counter = await CouponCounter.findOne({});
        console.log(counter);
        const response = {
            remaining: await Coupon.find({given:false}).count(),
            counter: counter ? counter[0].counter : '10'
        }
        resp.json({success: true, err: null, response: response});
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

export { couponsRoutes }

