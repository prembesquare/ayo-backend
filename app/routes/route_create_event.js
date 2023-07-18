const createEventController = require("../controller/controller_create_event.js");
const router = require("express").Router();
const { body } = require('express-validator');

router.get("/get", createEventController.getEvent);
router.get("/email/:email", createEventController.getEventByEmail);
router.get("/invite/:invitee_email",createEventController.getEventByinviteeEmail);
router.get("/event/:event_code",createEventController.getEventByEventCode);
router.post("/add",
[
  body('event_name')
    .isLength({ max: 50 })
    .withMessage('Event name must be maximum 50 characters'),
  body('event_address')
    .isLength({ max: 100 })
    .withMessage('Event address must be maximum 100 characters'),
  body('event_detail')
    .isLength({ max: 250 })
    .withMessage('Event detail must be maximum 100 characters'),
  body('event_code')
    .isLength({ max: 20 })
    .withMessage('Event code must be maximum 20 characters')
    .notEmpty()
    .withMessage('Event code must be provided'),

]
,createEventController.createEvent);
router.delete("/delete/:event_code", createEventController.deleteEvent);
router.put("/update/:event_code", createEventController.updateEvent);
module.exports = router;
