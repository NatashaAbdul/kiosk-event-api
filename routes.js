const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Routes
router.post("/attendee", controller.createAttendee);
router.get("/attendee", controller.getAllAttendee);
router.post("/registration", controller.createRegistration);
router.get("/registration", controller.getAllRegistration);
router.get("/attendee/:uid", controller.getSingleRegistration);
router.delete("/registration/:uid", controller.deleteRegistration);
router.delete("/attendee/:uid", controller.deleteAttendee);

module.exports = router;
