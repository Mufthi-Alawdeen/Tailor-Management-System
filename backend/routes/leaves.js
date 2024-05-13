const router = require("express").Router();
const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// Getting empid from employees
router.route("/getLeave").post((req, res) => {
    const { leaveType, dateFrom, dateTo, description, leaveStatus, rejectionReason, Eid } = req.body;

    // Check if the empId exists in the Employee collection
    Employee.findById(Eid)
        .then(employee => {
            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }

            // Create a new leave instance with empId
            const newLeave = new Leave({
                leaveType,
                dateFrom,
                dateTo,
                description,
                leaveStatus,
                rejectionReason,
                Eid
            });

            // Save the new leave entry
            newLeave.save()
                .then(() => {
                    res.json("Leave added!"); // Success response
                })
                .catch((err) => {
                    console.error(err);
                    res.status(400).json({ error: "Error adding leave", details: err.errors });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Error finding employee", details: err.message });
        });
});

// CRUD - CREATE(POST)
// http://localhost:8070/leave/add

router.route("/add").post((req, res) => { // create route
    // Extract leave details from the request body
    const { leaveType, dateFrom, dateTo, description, leaveStatus, rejectionReason, Eid } = req.body;

    // Check if empId exists
    if (!Eid) {
        return res.status(400).json({ error: "Employee ID (empId) is required" });
    }

    // Create a new leave instance
    const newLeave = new Leave({
        leaveType,
        dateFrom,
        dateTo,
        description,
        leaveStatus,
        rejectionReason,
        Eid // Include empId in the leave object
    });

    // Save the new leave entry
    newLeave.save()
        .then(() => {
            res.json("Leave added!"); // Success response
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ error: "Error adding leave", details: err.errors });
        });
});

//CRUD - READ(GET)
//http://localhost:8070/leave
router.route("/").get( (req,res)=> {

    //\/leave variable we made above
    Leave.find().then( (leave)=>{
        res.json(leave)
    }).catch((err)=>{
        console.log(err)
    })

})

// CRUD - UPDATE (PUT)
// http://localhost:8070/leave/update/mongoDB_ID
router.route("/update/:id").put(async(req, res) => { // asynchronous function
    try {
        const leaveId = req.params.id; // primary key
        const { leaveType, dateFrom, dateTo, description, leaveStatus, rejectionReason } = req.body; // destructuring


        const updateLeave = { // object that updates
            leaveType,
            dateFrom,
            dateTo,
            description,
            leaveStatus,
            rejectionReason,
        };

        // Find and update the leave entry by its MongoDB ID
        const updatedLeave = await Leave.findByIdAndUpdate(leaveId, updateLeave);

        if (!updatedLeave) {
            return res.status(404).json({ error: "Leave not found" });
        }

        res.status(200).json({ status: "Leave updated" }); // Method 2 displaying success
    } catch (err) {
        res.status(500).json({ status: "Error with updating data", error: err.message });
    }
});


//CRUD - DELETE(DELETE)
//http://localhost:8070/leave/delete/mongoDB_ID
router.route("/delete/:id").delete(async(req,res)=>{
    let leaveId = req.params.id;

    //async needs a promise so we add await
    await Leave.findByIdAndDelete(leaveId)
    .then(()=>{
        res.status(200).send({status: "Leave deteted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"error with delete Leave", error :err.message})
    })
})

//CRUD - only one Leave data(GET)
//http://localhost:8070/leave/get/mongoDB _ID
router.route("/get/:id").get(async(req,res)=>{
    let leaveId = req.params.id;
    try {
        const leave = await Leave.findById(leaveId);//Employee.findOne fetch using leaveStatus
        if (!leave) {
            return res.status(404).send({ status: "error", message: "Leave not found" });
        }
        res.status(200).send({ status: "Leave fetched", leave: leave });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "error with get Leave", error: err.message });
    }
});

router.route("/getByEid/:Eid").get(async (req, res) => {
    let employeeId = req.params.Eid;
    try {
        const leaves = await Leave.find({ Eid: employeeId });
        if (leaves.length === 0) {
            return res.status(404).send({ status: "error", message: "No leaves found for this employee" });
        }
        res.status(200).send({ status: "Leaves fetched", leaves: leaves });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "error with get Leaves by Eid", error: err.message });
    }
});

//!!!!!IMPORTANT
module.exports = router;
