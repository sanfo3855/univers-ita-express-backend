import * as mongoose from 'mongoose';

const TextSurveySchema = new mongoose.Schema({
    text: {type: String,required:true},
    questions: [{
        question: {type: String, required:true},
        answer: [{type: String, required:true}],
    }],
    date: {type: Date, required: true}
});

const TextSurvey = mongoose.model('text-survey', TextSurveySchema);

export { TextSurvey }