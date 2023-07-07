const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, requied: true },
    imageUrl: { type: String, required: true },
    year: { type: String, required: true },
    genre: { type: String, required: true },
    ratings:[
        {
            userId: { type: String, required: true },
            grade: { type: String, required: true }
        }
    ],
    averageRating: { type: String, required: true}
});

module.exports = mongoose.model('Book', bookSchema);