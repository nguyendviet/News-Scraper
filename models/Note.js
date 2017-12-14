const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const NoteSchema = new Schema({
    title: String,
    body: String
});

// Create model from schema
const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;