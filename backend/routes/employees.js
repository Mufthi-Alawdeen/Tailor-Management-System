const router = require("express").Router();
const Employee = require("../models/Employee");
let Student = require("../models/Employee");//importing Employee.js model


// Function to generate EID
function generateEID() {
    const randomNum = Math.floor(Math.random() * 10000); // Generate a random number
    const paddedNum = String(randomNum).padStart(5, "0"); // Pad the number to have 5 digits
    return "EID" + paddedNum; // Return the formatted EID
}
//CRUD - CREATE(POST)
//http://localhost:8070/employee/add
router.route("/add").post((req,res)=>{      //create route
    const fname = req.body.fname;//method 1
    const lname = req.body.lname;
    const phoneNumber = Number(req.body.phoneNumber);
    const address = req.body.address;
    const email = req.body.email;
    const DOB = req.body.DOB;
    const jobrole = req.body.jobrole;
    const hireDate = req.body.hireDate;
    const salary = req.body.salary;

    const newEmployee = new Employee({//object
        Eid: generateEID(), // Generating Eid
        fname,
        lname,
        phoneNumber,
        address,
        email,DOB,jobrole,hireDate,salary
        //when adding a new Variable makesure to update AddEmployee.js
    })

    //calling object ,passing values as a document
    /*v1 working
    newEmployee.save().then(()=>{//Method 1 displaying success
        //if successful
        res.json("Employee added!")//json format
    }).catch(()=>{
        //unsuccessful CATCHING ERROR
        console.log(err);
    })*/
    /*v2 working
    newEmployee.save().then(() => {
        // Method 1 displaying success
        res.json("Employee added!"); // JSON format
    }).catch((err) => {
        // Unsuccessful CATCHING ERROR
        console.log(err);
        res.status(500).json({ error: "Error adding employee." });
    });*/
    newEmployee.save()
    .then(() => {
        // Method 1 displaying success
        res.json("Employee added!"); // JSON format
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({ error: "Error adding employee", details: err.errors });
    });
})    


//CRUD - READ(GET)
//http://localhost:8070/employee
router.route("/").get( (req,res)=> {

    //\/Employee variable we made above
    Employee.find().then( (employees)=>{
        res.json(employees)
    }).catch((err)=>{
        console.log(err)
    })

})

//CRUD - UPDATE (PUT)(using auto generated mongoDB object ID)
//http://localhost:8070/employee/update/mongoDB _ID
//remove async if any errors happen
router.route("/update/:id").put(async(req,res)=>{//asynchronous function
    let userId = req.params.id;//primary key
    const{fname,
        lname,
        phoneNumber,
        address,
        email,DOB,jobrole,hireDate,salary} = req.body;//(DESTRUCTURE)(Method 2) the same as const fname = req.params.name;
    
    const updateEmployee = {//object that updates
        fname,
        lname,
        phoneNumber,
        address,
        email,DOB,jobrole,hireDate,salary
    }

    //async needs a promise so we add await
    const update = await Employee.findByIdAndUpdate(userId,updateEmployee)
    .then(()=>{//Employee.findOne fetch using name/nic/email
        res.status(200).send({status: "user updated"})//Method 2 displaying success
    }).catch((err)=>{
        res.status(500).send({status : "Error with updating data", error:err.message});
    })
})

//CRUD - DELETE(DELETE)
//http://localhost:8070/employee/delete/mongoDB _ID
router.route("/delete/:id").delete(async(req,res)=>{
    let userId = req.params.id;

    //async needs a promise so we add await
    await Employee.findByIdAndDelete(userId)
    .then(()=>{
        res.status(200).send({status: "user deteted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status:"error with delete user", error :err.message})
    })
})

//CRUD - only one employees data(GET)
//http://localhost:8070/employee/get/mongoDB _ID
router.route("/get/:id").get(async(req,res)=>{
    let userId = req.params.id;
    try {
        const user = await Student.findById(userId);//Employee.findOne fetch using name/nic/email
        if (!user) {
            return res.status(404).send({ status: "error", message: "User not found" });
        }
        res.status(200).send({ status: "user fetched", user: user });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "error with get user", error: err.message });
    }
});

router.get('/getby/:eid', async (req, res) => {
    const Eid = req.params.eid; // Use req.params.eid instead of req.params.Eid

    try {
        // Find an employee with the given Eid
        const employee = await Employee.findOne({ Eid });

        if (employee) {
            // Employee with the given Eid exists
            res.status(200).json({ exists: true });
        } else {
            // Employee with the given Eid does not exist
            res.status(200).json({ exists: false });
        }
    } catch (err) {
        console.error('Error checking employee existence:', err);
        res.status(500).json({ error: 'An error occurred while checking employee existence' });
    }
});

router.get('/getbyEid/:eid', async (req, res) => {
    const Eid = req.params.eid;

    try {
        // Find an employee with the given Eid
        const employee = await Employee.findOne({ Eid });

        if (employee) {
            // Employee with the given Eid exists
            res.status(200).json({ exists: true, employee });
        } else {
            // Employee with the given Eid does not exist
            res.status(200).json({ exists: false });
        }
    } catch (err) {
        console.error('Error checking employee existence:', err);
        res.status(500).json({ error: 'An error occurred while checking employee existence' });
    }
});


/*router.route("/get/:id").get(async(req,res)=>{
    let userId = req.params.id;
    await Student.findById(userId)//Employee.findOne fetch using name/nic/email
    .then(()=>{
        res.status(200).send({status : "user fetched", user:user})
    }).catch((err)=>{
        console.log(err.message)
        res.status(500).send({sttus: "error with get user", error:err.message})
    })
})*/


//!!!!!IMPORTANT
module.exports = router;
