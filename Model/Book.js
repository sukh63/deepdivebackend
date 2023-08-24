const mongoose = require('mongoose');

const bookschema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: false
    },
    ISBN: {
        type: String,
        required: true

    },
    userid: {
        type: String,
        required: false

    },
    date:{
        type: Date,
        required: true 
    },
    reviews: [{
        uid: {
            type:String,
            required: false
        },
        review: {
            type: String,
            required:false
        },
        rating: {
            type: Number,
            required:false
        },
        date: {
            type: Date,
            required:false
        }
    }]

})







const Book = mongoose.model('BOOK', bookschema);

module.exports = Book;