const mongoose = require('mongoose');
const { EMAIL_REGEX } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Минимальная длина поля "name" - 2'],
        maxlength: [30, 'Максимальная длина поля "name" - 30'],
        max: 30
    },
    email: {
        type: String,
        unique: true,
        autoIndex: true,
        required: true,
        minlength: [2, 'Минимальная длина поля "email" - 2'],
        maxlength: [30, 'Максимальная длина поля "email" - 30'],
        validate: {
            validator(v) {
              return EMAIL_REGEX.test(v);
            },
            message: 'Некорректный email',
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
}, { versionKey: false }) 
module.exports = mongoose.model('user', userSchema);

