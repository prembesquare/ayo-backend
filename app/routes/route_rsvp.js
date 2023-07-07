const rsvpController = require("../controller/controller_rsvp");
const router = require("express").Router();

router.post("/add", rsvpController.createRSVP);
router.get("/status/:status", rsvpController.getRSVPByStatus);

module.exports = router;
