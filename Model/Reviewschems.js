const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    uid: {
        type:String,
        required: true
    },
    review: {
        type: String,
        required:true
    },
    rating: {
        type: Number,
        required:true
    },
   
   bookid: {
        type: String,
        required:true
    },
   
   
    date: {
        type: Date,
        required:true
    }
})

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;