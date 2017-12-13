const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
var NoteSchema = new Schema({
    title: String,
    body: String
});

// Create model from schema
var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;