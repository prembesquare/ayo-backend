const RSVP = require("../models/model_rsvp");
const jwt = require("jsonwebtoken");
const CustomError = require('../middleware/CustomError');

async function createRSVP(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const inviteeEmail = decoded.email;
    const eventCode = req.body.event_code;
    console.log(inviteeEmail);

    req.body.invitee_email = inviteeEmail;
    req.body.event_code = eventCode;

    const addRSVP = await RSVP.addRSVP(req.body);
    if (addRSVP.success) {
      console.log(addRSVP.message);
      res.status(200).send(addRSVP.message);
    } else {
      console.log(addRSVP.message);
      throw new CustomError(400, addRSVP.message);
    }
  } catch (error) {
    next(error);
  }
}

async function getRSVPByStatus(req, res, next) {
  try {
    const rsvpStatus = req.params.status;
    const rsvp = await RSVP.getRSVPByStatus(rsvpStatus);
    if (rsvp.success) {
      console.log("RSVPs found:", rsvp.data);
      res.status(200).send(rsvp.data);
    } else {
      throw new CustomError(404, rsvp.message);
    }
  } catch (error) {
    next(error);
  }
}

async function getYesStatus(req, res, next) {
  try {
    const eventCode = req.params.event_code;
    const rsvp = await RSVP.getYesStatus(eventCode);
    if (rsvp.success) {
      console.log("RSVPs found:", rsvp.data);
      res.status(200).send(rsvp.data);
    } else {
      throw new CustomError(404, rsvp.message);
    }
  } catch (error) {
    next(error);
  }
}

async function getNoStatus(req, res, next) {
  try {
    const eventCode = req.params.event_code;
    const rsvp = await RSVP.getNoStatus(eventCode);
    if (rsvp.success) {
      console.log("RSVPs found:", rsvp.data);
      res.status(200).send(rsvp.data);
    } else {
      console.log(rsvp.message);
      throw new CustomError(404, rsvp.message);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { createRSVP, getRSVPByStatus, getYesStatus, getNoStatus };
