const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookdataDb');
const Schema = mongoose.Schema;
var BookSchema = new Schema({
    title: String,
author: String,
genre: String,
synopsis: String,
image: String,
imagepath:String
});
var BookData = mongoose.model('bookdata', BookSchema);
module.exports = BookData;
