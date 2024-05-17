const express = require('express');
const router = express.Router();
const EmployeeBonus = require('../models/Employee_Bonus');

// Route to add a new employee bonus record
router.post('/add', async (req, res) => {
    try {
        const { Eid, bonus, bonusType, month } = req.body;
        const newEmployeeBonus = new EmployeeBonus({ Eid, bonus, bonusType, month });
        await newEmployeeBonus.save();
        res.status(201).json({ message: 'Employee bonus record added successfully' });
    } catch (error) {
        console.error('Error adding employee bonus record:', error);
        res.status(500).json({ error: 'An error occurred while adding employee bonus record' });
    }
});

// Route to get all employee bonus records
router.get('/all', async (req, res) => {
    try {
        const employeeBonuses = await EmployeeBonus.find();
        res.status(200).json(employeeBonuses);
    } catch (error) {
        console.error('Error fetching employee bonus records:', error);
        res.status(500).json({ error: 'An error occurred while fetching employee bonus records' });
    }
});

// Route to get employee bonus record by Eid
router.get('/get/:Eid', async (req, res) => {
    try {
        const { Eid } = req.params;
        const employeeBonus = await EmployeeBonus.findOne({ Eid });
        if (employeeBonus) {
            res.status(200).json(employeeBonus);
        } else {
            res.status(404).json({ message: 'Employee bonus record not found' });
        }
    } catch (error) {
        console.error('Error fetching employee bonus record:', error);
        res.status(500).json({ error: 'An error occurred while fetching employee bonus record' });
    }
});

// Route to update employee bonus record by Eid
router.put('/update/:Eid', async (req, res) => {
    try {
        const { Eid } = req.params;
        const { bonus, month, bonusType } = req.body;
        const updatedEmployeeBonus = await EmployeeBonus.findOneAndUpdate({ Eid }, { bonus, bonusType, month }, { new: true });
        if (updatedEmployeeBonus) {
            res.status(200).json({ message: 'Employee bonus record updated successfully' });
        } else {
            res.status(404).json({ message: 'Employee bonus record not found' });
        }
    } catch (error) {
        console.error('Error updating employee bonus record:', error);
        res.status(500).json({ error: 'An error occurred while updating employee bonus record' });
    }
});

// Route to delete employee bonus record by Eid
router.delete('/delete/:Eid', async (req, res) => {
    try {
        const { Eid } = req.params;
        const deletedEmployeeBonus = await EmployeeBonus.findOneAndDelete({ Eid });
        if (deletedEmployeeBonus) {
            res.status(200).json({ message: 'Employee bonus record deleted successfully' });
        } else {
            res.status(404).json({ message: 'Employee bonus record not found' });
        }
    } catch (error) {
        console.error('Error deleting employee bonus record:', error);
        res.status(500).json({ error: 'An error occurred while deleting employee bonus record' });
    }
});

module.exports = router;
