const mongoose = require('mongoose');



const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
})
const Contact = mongoose.model('CONTACT2', contactSchema);

module.exports = Contact;