import * as mongoose from 'mongoose';

const TextSurveySchema = new mongoose.Schema({
    text: {type: String,required:true},
    questions: [{
        question: {type: String, required:true},
        answer: {type: String, required:true},
    }]
});

const TextSurvey = mongoose.model('textSurvey', TextSurveySchema);

export { TextSurvey }