import * as express from 'express';
import { TextSurvey } from './text-survey.model';
import * as jwt from 'jsonwebtoken';
import { jwtSecretAdmin, jwtSecretStudents } from '../environment.dev';
import * as exjwt from 'express-jwt';
import {User} from "./user.model";

const textSurveyRoutes = express.Router();

function getCurrentDate():Date { 
    let now = new Date(Date.now());
    return new Date(now.toString().substr(0,10));
}

textSurveyRoutes.post('/save', exjwt({secret:jwtSecretStudents}), async (req:express.Request,resp:express.Response,next:express.NextFunction) => {
    req.body.questions = JSON.stringify(req.body.questions)
    try{
        const student = req.body.student;
        const text = req.body.text;
        const questions = req.body.questions;

        let textSurvey = new TextSurvey({
            student: student,
            text: text,
            questions: JSON.parse(questions),
            date: Date.now()
        });
        await textSurvey.save(function (err, user) {
            if (err) return console.error(err);
            return user;
        });
        resp.status(200).json({success:true,err:null});
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

textSurveyRoutes.get('/stats', exjwt({secret:jwtSecretAdmin}), async (req:express.Request,resp:express.Response,next:express.NextFunction) => {
    try {
        let response = []
        let users: any = await User.find({});
        for (let user of users) {
            let count = await TextSurvey.find({student: user.username}).count()
            if (count != 0) {
                response.push({username: user.username, count: count});
            }
        }
        resp.json(response)
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
})

textSurveyRoutes.get('/all', exjwt({secret:jwtSecretAdmin}), async (req:express.Request,resp:express.Response,next:express.NextFunction) => {
    try {
        let items: any = await TextSurvey.find({});
        console.log(items);
        items = items.map((item) => {
            return {id: item._id, text: item.text, questions: item.questions, student: item.student, date: item.date}
        });
        resp.json(items);
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
})


export { textSurveyRoutes }