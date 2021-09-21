const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bookdataDb');
const Schema = mongoose.Schema;
var SignupSchema = new Schema({
    fname: String,
    lname: String,
mobnumber: String,
email: String,
password: String,
confirmpwd: String,
role:String
});
var SignupData = mongoose.model('signupdata', SignupSchema);
module.exports = SignupData;