
const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema({
  UserID: {
    type: String,
    required: true,
    unique: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v); // Email format validation
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  Address: {
    type: String,
    required: true,
  },
  ContactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Contact number format validation (10 digits)
      },
      message: props => `${props.value} is not a valid contact number!`,
    },
  },
  Type: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'], // Minimum length validation
  },
  ConfirmPassword: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        // Validate if confirm password matches password field
        return v === this.Password;
      },
      message: () => 'Confirm password does not match the password!',
    },
  },
});


usersSchema.pre('save', async function (next) {
  try {
    // Check if this is a new document
    if (this.isNew) {
      // Find the document with the highest UserID
      const highestUser = await mongoose.model('OnlineUsers')
        .findOne({}, { UserID: 1 }) // Only retrieve the UserID field
        .sort({ UserID: +1 }) // Sort in descending order to get the highest UserID first

      // If there are no documents or UserID is not found, start from 1
      let highestUserIDNumber = 0;
      if (highestUser && highestUser.UserID) {
        // Extract the numeric part of the UserID and increment it by 1
        const match = highestUser.UserID.match(/US(\d+)/);
        if (match && match[1]) {
          highestUserIDNumber = parseInt(match[1]);
        }
      }

      // Generate the next UserID by incrementing the highest UserID by 1
      this.UserID = `US${highestUserIDNumber + 3}`;
    }
    next();
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
});








const OnlineUsers = mongoose.model("OnlineUsers", usersSchema);

module.exports = OnlineUsers;

