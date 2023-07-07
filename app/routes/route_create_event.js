const createEventController = require("../controller/controller_create_event.js");
const router = require("express").Router();
router.get("/get", createEventController.getEvent);
router.get("/email/:email", createEventController.getEventByEmail);
router.get(
  "/invite/:invitee_email",
  createEventController.getEventByinviteeEmail
);
router.post("/add", createEventController.createEvent);
router.delete("/delete/:event_code", createEventController.deleteEvent);
router.put("/update/:event_code", createEventController.updateEvent);
module.exports = router;
