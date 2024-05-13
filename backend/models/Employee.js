const mongoose = require('mongoose');

const  Schema = mongoose.Schema;
const employeeExample = new Schema({
//mongoDB object ID will be created automatically when inserting
    
    //fname,lname,address,phoneNumber,Email,
    //employeeID,DOB,jobrole,hireDate,empImg
    Eid: {
        type: String,
        required: true,
        unique: true // Ensuring uniqueness
    },
    fname : {
        type:String,
        required : true//backend validation
    },
    lname : {
        type:String,
        required : true//backend validation
    },
    phoneNumber  : {
        type:Number,
        required :true//backend validation
    },
    address  : {
        type:String,
        required :true//backend validation
    },
    email  : {
        type:String,
        required :true//backend validation
    },
    jobrole : {
        type:String,
        required :true//backend validation
    },
    DOB : {
        type:Date,
        required :true//backend validation
    },
    hireDate : {
        type:Date,
        required :true//backend validation
    },
    salary : {
        type:Number,
        required :true//backend validation
    },
    

})
// Module                   Table Name  scehema Name
const Employee = mongoose.model("Employee", employeeExample);
module.exports = Employee;   //exporting the module