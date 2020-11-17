import * as mongoose from 'mongoose';

const CouponsSchema = new mongoose.Schema({
    code: {type: String, required: true},
    expirationDate: {type: String, required:true},
    site: {type: String, required: true},
    value: {type: Number, required: true},
    given: {type: Boolean, required: true},
    student: {type: String, required: false}
});

const Coupon = mongoose.model('coupon', CouponsSchema)

export { Coupon}