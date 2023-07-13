const rsvpController = require("../controller/controller_rsvp");
const router = require("express").Router();

router.post("/add", rsvpController.createRSVP);
router.get("/status/:status", rsvpController.getRSVPByStatus);
router.get("/yes/:event_code", rsvpController.getYesStatus);
router.get("/no/:event_code", rsvpController.getNoStatus);


module.exports = router;
