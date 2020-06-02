import * as express from 'express';
import {User} from './user.model';
import * as jwt from 'jsonwebtoken';
import {jwtSecretAdmin, jwtSecretStudents} from '../environment.dev';
import * as exjwt from 'express-jwt';

const userRoutes = express.Router();

function getCurrentDate(): Date {
    let now = new Date(Date.now())
    return new Date(now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay());
}

userRoutes.get('/all', exjwt({secret: jwtSecretAdmin}), async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    try {
        let items: any = await User.find({});
        console.log(items);
        items = items.map((item) => {
            return {id: item._id, username: item.username, password: item.password, type: item.type, validity: item.validity}
        });
        resp.json(items);
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

userRoutes.post('/check', async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    try {
        const body = req.body
        let userDoc = await User.findOne({username: body.username})
        if (userDoc) {
            let user = userDoc.toJSON();
            if (body.password === user.password) {
                if (user.validity === true) {
                    let token: string;
                    if (user.type === 'admin') {
                        token = jwt.sign({id: user.id, username: user.username}, jwtSecretAdmin, {expiresIn: '24h'});
                        resp.status(200).json({success: true, err: null, token: token})
                    } else if (user.type === 'student') {
                        token = jwt.sign({id: user.id, username: user.username}, jwtSecretStudents, {expiresIn: '24h'});
                        resp.status(200).json({success: true, err: null, token: token})
                    } else {
                        resp.status(403).json({success: false, err: "user type wrong or not specified"})
                    }
                } else {
                    resp.status(403).json({success: false, err: 'expired validity', token: null})
                }
            } else {
                resp.status(403).json({success: false, err: 'wrong password', token: null})
            }
        } else {
            resp.status(404).json({success: false, err: 'user not found', token: null})
        }
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

userRoutes.post('/create', exjwt({secret: jwtSecretAdmin}), async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    try {
        const body = req.body;
        console.log(body);
        let existUser = await User.findOne({username: body.username});
        console.log(existUser);
        if (!existUser) {
            let user = new User();
            if (body.username !== 'admin') {
                user = new User({
                    username: body.username,
                    password: body.password,
                    type: body.type,
                    validity: true
                });
            } else {
                user = new User({
                    username: body.username,
                    password: body.password,
                    type: body.type,
                    validity: true
                });
            }
            await user.save(function (err, user) {
                if (err) return console.error(err);
                return user;
            });
            console.log(user.toJSON());
            resp.status(200).json({success: true, err: null});
        } else {
            resp.status(403).json({success: false, err: "user already exist"});
        }
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

userRoutes.post('/expire', exjwt({secret: jwtSecretAdmin}), async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    try {
        const body = req.body;
        console.log('Exipring username: ' + body.username);
        let response = {};
        let user = (await User.findOne({username: body.username})).toJSON();
        if (user) {
            if (user.validity === true) {
                user.validity = false;
                await User.findOneAndUpdate({username: body.username}, user);
                resp.status(200).json({success: true, err: null});
            } else {
                resp.status(403).json({success: false, err: 'already expired'});
            }
        } else {
            resp.status(403).json({success: false, err: 'user not found'});
        }
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

userRoutes.delete('/delete', exjwt({secret: jwtSecretAdmin}), async (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    try {
        const body = req.body;
        console.log('Deleting username: ' + body.username);
        let response = {};
        let userDoc = await User.findOne({username: body.username})
        if (userDoc) {
            let user = userDoc.toJSON();
            await User.findOneAndDelete({username: body.username}, user);
            resp.status(200).json({success: true, err: null});
        } else {
            resp.status(403).json({success: false, err: 'user not found'});
        }
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

export {userRoutes}
