const accountSid = 'ACe17b45b1bb0cfcf26caa4577907674ed';
const authToken = '8dc6c10a71fc7a8626b750885e48642e';
const client = require('twilio')(accountSid, authToken);
const router = require("express").Router();
const Inquiry = require("../models/Inquiry");

// Route to add a new inquiry
router.post("/add", (req, res) => {
    const { UserID,First_Name, Last_Name, Type, Email, Contact_number, Description, Order_ID, Rent_ID,Reply } = req.body;
    const newInquiry = new Inquiry({UserID, First_Name, Last_Name, Type, Email, Contact_number, Description,Order_ID, Rent_ID, Reply });

    newInquiry.save()
        .then(() => res.json({ message: "Inquiry Added" }))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Route to retrieve all inquiries
router.get("/retrieve", (req, res) => {
    Inquiry.find()
        .then(inquiries => res.json(inquiries))
        .catch(err => res.status(400).json({ error: err.message }));
});

router.get("/retrieve/:userId", (req, res) => {
    const userId = req.params.userId;

    Inquiry.find({ UserID: userId }) // Use 'UserID' instead of 'UserId'
        .then(inquiries => res.json(inquiries))
        .catch(err => res.status(400).json({ error: err.message }));
});


// Route to update an inquiry by ID
router.put("/update/:id", (req, res) => {
    const inquiryId = req.params.id;
    const { First_Name, Last_Name, Type, Email, Contact_number, Description, Order_ID, Rent_ID, Reply, updatedAt } = req.body;
    const updatedInquiry = { First_Name, Last_Name, Type, Email, Contact_number, Description, Order_ID, Rent_ID, Reply, updatedAt };

    Inquiry.findByIdAndUpdate(inquiryId, updatedInquiry, { new: true }) // Set { new: true } to return the updated document
        .then(inquiry => {
            if (!inquiry) {
                return res.status(404).json({ error: "Inquiry not found" });
            }
            res.json({ message: "Inquiry updated", inquiry }); // Return the updated inquiry in the response
        })
        .catch(err => res.status(400).json({ error: err.message }));
});

// admin approve


// Route to delete an inquiry by ID
router.delete("/delete/:id", (req, res) => {
    const inquiryId = req.params.id;

    Inquiry.findByIdAndDelete(inquiryId)
        .then(() => res.json({ message: "Inquiry deleted" }))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Route to get an inquiry by ID
router.get("/get/:id", (req, res) => {
    const inquiryId = req.params.id;

    Inquiry.findById(inquiryId)
        .then(inquiry => res.json(inquiry))
        .catch(err => res.status(400).json({ error: err.message }));
});


router.post("/sendSms", (req, res) => {
    const { message } = req.body;

    client.messages
    .create({
        body: message,
        from: '+16362671655',
        to: '+94720357757'
    })
        .then(message => {
            console.log(message.sid)
            res.send('MESSAGE SENT')
        }).catch(err => res.status(400).send(err.message))
    // .done();
});

module.exports = router;

