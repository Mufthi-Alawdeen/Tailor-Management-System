const express = require('express');
const router = express.Router();
const EmployeeAccount = require('../models/EmployeeAccount'); // Adjust the path as per your project structure
const ObjectId = require('mongoose').Types.ObjectId;

// Add Employee
router.post('/add', async (req, res) => {
  try {
    const { Eid, firstName, lastName, password } = req.body;
    const newEmployee = new EmployeeAccount({ Eid, firstName, lastName, password });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve all Employees
router.get('/get', async (req, res) => {
  try {
    const employees = await EmployeeAccount.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error retrieving employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve Employee by ID
router.get('/get/:id', async (req, res) => {
  try {
    const employee = await EmployeeAccount.findOne({ Eid: req.params.id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error retrieving employee by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Update Employee by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const updatedEmployee = await EmployeeAccount.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, password },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/update/:eid', async (req, res) => {
  try {
    const { password } = req.body;
    const updatedEmployee = await EmployeeAccount.findOneAndUpdate(
      { Eid: req.params.eid },
      { password: password },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee by Eid:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/updateBy/:eid', async (req, res) => {
  try {
    const { password } = req.body;
    
    // Find the employee by Eid
    const employee = await EmployeeAccount.findOne({ Eid: req.params.eid });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Get the ObjectId of the employee
    const employeeId = employee._id;

    // Update the employee by ObjectId
    const updatedEmployee = await EmployeeAccount.findByIdAndUpdate(
      employeeId,
      { password: password },
      { new: true }
    );

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating employee by Eid:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete Employee by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedEmployee = await EmployeeAccount.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete/:eid', async (req, res) => {
  try {
    const deletedEmployee = await EmployeeAccount.findOneAndDelete({ Eid: req.params.eid });
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee by Eid:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/login', async (req, res) => {
    const { Eid, password } = req.body;
  
    try {
        // Find user by Eid
        const user = await EmployeeAccount.findOne({ Eid });
  
        // Check if user exists
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Eid or password' });
        }
  
        // Check if the password matches
        if (password !== user.password) {
            return res.status(400).json({ success: false, message: 'Invalid Eid or password' });
        }
  
        // If password matches, send success response along with user details
        res.json({ success: true, message: 'Login successful', user });
  
    } catch (error) {
        // Handle any errors that occur during database query or password comparison
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  


  

module.exports = router;

