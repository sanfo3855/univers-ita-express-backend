import * as mongoose from 'mongoose';
import {Schema} from "mongoose";

const TextSurveySchema = new mongoose.Schema({
    student: {type:String, required: true},
    text: {type: String, required:false},
    questions: {type:Schema.Types.Mixed, required: false},
    date: {type: Date, required: true}
});

const TextSurvey = mongoose.model('text-survey', TextSurveySchema);

export { TextSurvey }