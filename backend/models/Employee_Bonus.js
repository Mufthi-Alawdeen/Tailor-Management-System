const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeBonusSchema = new Schema({
    Eid: {
        type: String,
        required: true
    },
    bonus: {
        type: Number,
        required: true
    },
    bonusType:{
        type: String,
        required: true
    },
    month: {
        type: String,
        required: true
    }
});

const EmployeeBonus = mongoose.model("EmployeeBonus", employeeBonusSchema);

module.exports = EmployeeBonus;
