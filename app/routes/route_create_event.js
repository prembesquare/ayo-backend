const createEventController = require ('../controller/controller_create_event.js');
const router = require("express").Router();
router.get("/", createEventController.getEvent);
router.get("/:email", createEventController.getEventByEmail);
router.post("/", createEventController.createEvent);
router.delete("/:id", createEventController.deleteEvent);
router.put("/:id", createEventController.updateEvent); 
module.exports = router;