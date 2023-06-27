const RSVP = require("../models/model_rsvp");
const jwt = require("jsonwebtoken");

async function createRSVP(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const invitedEmail = decoded.email;
    const eventCode = req.body.event_code;

    req.body.invited_email = invitedEmail;
    req.body.event_code = eventCode;

    const addRSVP = await RSVP.addRSVP(req.body);
    if (addRSVP) {
      console.log("RSVP added successfully");
      res.send("RSVP added successfully");
    } else {
      console.log("Failed to add RSVP");
      res.send("Failed to add RSVP");
    }
  } catch (error) {
    console.error(error);
    res.render("error");
  }
}


async function getRSVPByStatus(req, res) {
  try {
    const rsvpStatus = req.params.status;
    const rsvp = await RSVP.getRSVPByStatus(rsvpStatus);
    if (rsvp) {
      console.log("RSVPs found:", rsvp);
      res.send(rsvp);
    } else {
      console.log("RSVPs not found");
      res.send("RSVPs not found");
    }
  } catch (error) {
    console.error(error);
    res.render("error");
  }
}

module.exports = { createRSVP, getRSVPByStatus };
