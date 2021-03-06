const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    customerID:{
        type:Schema.Types.ObjectId,
        ref:'customers'
    },
    hotelID:{
        type:Schema.Types.ObjectId,
        ref:'hotels'
    },
    check_in_date: {
        type:Date,
        required:true
    },
    check_out_date: {
        type:Date,
        required:true
    },
    typeOfRoom: {
        type:String,
        required:true
    },
    numOfRoom: {
        type:Number,
        required:true
    },
    numOfNights:{
        type:Number,
        required:true
    },
    nightlyRate:{
        type:Number,
        required:true
    },
    reservedDate:{
        type:Date,
        default: Date.now
    },
    status:{     // 0 stand for just booked, 1 for check-in, 2 for check-out, 3 for cancel
        type:Number,
        default:0
    },
    changed:{
        type:Boolean,
        default:false
    },
    new_check_in_date: {
        type:Date,
    },
    new_check_out_date: {
        type:Date,
    },
    subtotal:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        default:0
    },
    taxesAndFees:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    rewardPointsUsed:{
        type:Number,
        default:0
    },
    rewardPointsEarned:{
        type:Number,
        default:0
    },
    rewardDiscount:{
        type:Number,
        default:0
    },
    review:{
        type:String,
        default:""
    },
    starReview:{
        type:Number,
        default:0
    },
    welcome:{
        type:Boolean,
        default:false
    }
})

module.exports = Booking = mongoose.model("bookings", BookingSchema);