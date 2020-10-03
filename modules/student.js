const mongoose = require("mongoose")
const studentSchema = new mongoose.Schema({
    country: String,
    fname: String,
    lname: String,
    email: String,
    password: String,
    address: String,
    city: String,
    stateInfo: String,
    postCode: Number,
    mobilePhone: Number,
})
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
