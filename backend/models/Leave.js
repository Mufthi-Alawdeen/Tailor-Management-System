const mongoose = require('mongoose');

const  Schema = mongoose.Schema;
const leaveExample = new Schema({
    
    //leaveType,dateFrom,dateTo,description,leaveStatus,rejectionReason
    leaveType : {
        type:String,
        required : true//backend validation
    },
    dateFrom : {
        type:Date,
        required : true//backend validation
    },
    dateTo  : {
        type:Date,
        required :true//backend validation
    },
    description  : {
        type:String,
        required :false//backend validation
    },
    leaveStatus  : {
        type:String,
        required :false//backend validation
    },
    rejectionReason:{
        type :String,
        required:false
    },
    Eid: {
        type: String,
        required: true
    }
    
})
// Module                   Table Name  scehema Name
const Leave = mongoose.model("Leave", leaveExample);
module.exports = Leave;   //exporting the module
