const mongoose = require("mongoose");

const { Schema } = mongoose;

const employeeSchema = new Schema({
  Eid: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [4, 'Password must be at least 4 characters long'],
  },
  confirmPassword: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        // Validate if confirm password matches password field
        return v === this.password;
      },
      message: () => 'Confirm password does not match the password!',
    },
  },
});


const EmployeeAccount = mongoose.model("EmployeeAccount", employeeSchema);

module.exports = EmployeeAccount;
