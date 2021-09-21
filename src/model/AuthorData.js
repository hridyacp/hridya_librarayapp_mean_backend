const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookdataDb');
const Schema = mongoose.Schema;
var AuthorSchema = new Schema({
    author: String,
book: String,
genre: String,
info: String,
image: String,
imagepath: String
});
var AuthorData = mongoose.model('authordata', AuthorSchema);
module.exports = AuthorData;