import * as express from 'express';
import { TextSurvey } from './text-survey.model';
import * as jwt from 'jsonwebtoken';
import { jwtSecretAdmin, jwtSecretStudents } from '../environment.dev';
import * as exjwt from 'express-jwt';

const textSurveyRoutes = express.Router();

function getCurrentDate():Date { 
    let now = new Date(Date.now())
    return new Date(now.getFullYear()+"-"+now.getMonth()+"-"+now.getDay());
}

textSurveyRoutes.post('/save', exjwt({secret:jwtSecretStudents}), async (req:express.Request,resp:express.Response,next:express.NextFunction) => {
    try{
        const text = req.body.text
        const questions = req.body.questions;
        console.log(text);
        console.log(questions);

        let textSurvey = new TextSurvey({
            text: text,
            questions: questions,
            date: getCurrentDate()
        });
        await textSurvey.save(function (err, user) {
            if (err) return console.error(err);
            return user;
        });
        console.log(textSurvey);
        resp.status(200).json({success:true,err:null});
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
});

textSurveyRoutes.get('/stats', exjwt({secret:jwtSecretAdmin}), async (req:express.Request,resp:express.Response,next:express.NextFunction) => {
    //get stat related to text and analytics
})

textSurveyRoutes.get('/all', exjwt({secret:jwtSecretAdmin}), async (req:express.Request,resp:express.Response,next:express.NextFunction) => {
    try {
        let items: any = await TextSurvey.find({});
        console.log(items);
        items = items.map((item) => {
            return {id: item._id, text: item.text, questions: item.questions}
        });
        resp.json(items);
    } catch (err) {
        resp.status(500);
        resp.end();
        console.error('Caught error', err);
    }
})


export { textSurveyRoutes }