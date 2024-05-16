const router = require("express").Router();
const bcrypt = require("bcrypt");
const OnlineUsers = require("../models/OnlineUser"); // Assuming your schema file is named "UserDetail.js"
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const generateUniqueUserID = async () => {
  let isUnique = false;
  let attemptCount = 0;
  let generatedUserID;

  while (!isUnique && attemptCount < 10) {
    // Generate a random number
    const randomNumber = Math.floor(Math.random() * 1000);

    generatedUserID = `US${randomNumber}`;

    // Check if the generated UserID already exists
    const existingUser = await OnlineUsers.findOne({ UserID: generatedUserID });
    if (!existingUser) {
      isUnique = true; // Set isUnique to true if the generated UserID is unique
    } else {
      attemptCount++; // Increment attempt count
    }
  }

  if (!isUnique) {
    throw new Error('Failed to generate a unique UserID after 10 attempts.');
  }

  return generatedUserID;
};



router.post("/addUser", async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Email,
      Address,
      ContactNumber,
      Type,
      Role,
      Password,
      ConfirmPassword,
    } = req.body;

    // Check if Password and ConfirmPassword match
    if (Password !== ConfirmPassword) {
      return res.status(400).json({ error: "Password and ConfirmPassword do not match" });
    }

    // Check if Email is unique
    const existingUser = await OnlineUsers.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ error: "User with the same Email already exists." });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the saltRounds

    // Generate a unique random UserID
    const UserID = await generateUniqueUserID();

    // Create a new user instance with encrypted password
    const newUser = new OnlineUsers({
      UserID,
      FirstName,
      LastName,
      Email,
      Address,
      ContactNumber,
      Type,
      Role,
      Password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User added successfully", UserID: newUser.UserID });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





// Get all users
router.route("/getAllUsers").get((req, res) => {
  OnlineUsers.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update a user by ID
router.put("/updateUser/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  Users.findByIdAndUpdate(id, updateData, { new: true })
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(400).json({ error: err.message }));
});

router.put("/updateUserByUserID/:userID", async (req, res) => {
  const { userID } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await OnlineUsers.findOneAndUpdate({ UserID: userID }, updateData, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a user by ID
router.delete("/deleteUser/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Assuming you have a User model
    const user = await OnlineUsers.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ status: "User deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});





// Get a user by ID
router.get("/getUserById/:id", (req, res) => {
  const { id } = req.params;

  OnlineUsers.findOne({ UserID: id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});



// Get a user by UserID
router.get("/getUserByUserID/:userID", (req, res) => {
  const { userID } = req.params;

  OnlineUsers.findOne({ UserID: userID })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error("Error fetching user by userID:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    });
});



router.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    // Find user by email
    const user = await OnlineUsers.findOne({ Email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // If password matches, send success response along with user details
    res.json({ success: true, message: 'Login successful', user });

  } catch (error) {
    // Handle any errors that occur during database query or password comparison
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




let otpStorage = {};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'arm.medi.lab@gmail.com',
    pass: 'fpie hnge pwio htwu',
  },
});

function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: 'numeric',
  });
}

async function sendOTP(email) {
  const otp = generateOTP();
  otpStorage[email] = otp; // Save OTP in in-memory storage

  const mailOptions = {
    from: '"Your Name" <msrkandy2000@gmail.com>',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return { success: true, message: 'OTP sent successfully', otp: otp }; // Return the generated OTP
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, message: 'Failed to send OTP' };
  }
}

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const result = await sendOTP(email);

  if (result.success) {
    otpStorage[email] = result.otp; // Store the generated OTP in the otpStorage object
    res.status(200).json({ message: result.message });
  } else {
    res.status(500).json({ message: result.message });
  }
});



router.post('/check-email', async (req, res) => {
  const { Email } = req.body;
  try {
    // Search for a user with the provided email
    const user = await OnlineUsers.findOne({ Email });

    // If a user with this email exists, return true, otherwise false
    res.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { otp, email } = req.body;
  const generatedOTP = otpStorage[email]; // Retrieve the stored OTP for the email


  try {
    if (!generatedOTP || generatedOTP !== otp) {
      // If the OTP doesn't match or no OTP found, send an error response
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    // Clear the stored OTP after successful verification (optional)
    delete otpStorage[email];

    // Send a success response
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});





router.put('/update-password/:email', async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;
  try {
    // Update the password for the user with the provided email
    await OnlineUsers.updateOne({ Email: email }, { Password: await bcrypt.hash(newPassword, 10) });

    // If the password is updated successfully, send a success response
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
