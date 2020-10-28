import * as mongoose from 'mongoose';
import {Schema} from "mongoose";

const TextSurveySchema = new mongoose.Schema({
    text: {type: String, required:true},
    questions: [{
        question: {type: String, required:true},
        answer: {type: Schema.Types.Mixed, required: true}
    }],
    date: {type: Date, required: true}
});

const TextSurvey = mongoose.model('text-survey', TextSurveySchema);

export { TextSurvey }