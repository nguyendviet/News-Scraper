const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
});

// Create model from schema
var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;