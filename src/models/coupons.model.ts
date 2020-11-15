import * as mongoose from 'mongoose';

const CouponsSchema = new mongoose.Schema({
    code: {type: String, required: true},
    expirationDate: {type: String, required:true},
    site: {type: String, required: true},
    given: {type: Boolean, required: true},
    student: {type: String, required: false}
});

const CouponCounterSchema = new mongoose.Schema({
    counter: {type: Number, required: true}
});

const Coupon = mongoose.model('coupon', CouponsSchema)

const CouponCounter = mongoose.model('couponCounter', CouponCounterSchema);

export { Coupon, CouponCounter}