const CreateEvent = require("../models/model_create_event");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const CustomError = require('../middleware/CustomError');

async function getEvent(req, res) {
  try {
    const events = await CreateEvent.getEvent();
    if (events.success) {
      console.log("Events found:", events.data);
      res.status(200).send(events.data);
    } else {
      console.log(events.message);
      throw new CustomError(500, result.message);
    }
  } catch (error) {
    next(error);
  }
}

async function getEventByEmail(req, res) {
  try {
    const email = req.params.email;
    const events = await CreateEvent.getEventByEmail(email);
    if (events.success) {
      console.log("Events found:", events.data);
      res.status(200).send(events.data);
    } else {
      console.log(events.message);
      throw new CustomError(500, result.message);
    }
  } catch (error) {
    next(error);
  }
}

async function getEventByinviteeEmail(req, res) {
  try {
    const inviteeEmail = req.params.invitee_email;
    const events = await CreateEvent.getEventByinviteeEmail(inviteeEmail);
    if (events.success) {
      console.log("Events found:", events.data);
      res.status(200).send(events.data);
    } else {
      console.log(events.message);
      throw new CustomError(500, result.message);
    }
  } catch (error) {
    next(error);
  }
}

async function getEventByEventCode(req, res) {
  try {
    const eventCode = req.params.event_code;
    const events = await CreateEvent.getEventByEventCode(eventCode);
    if (events.success) {
      console.log("Events found:", events.data);
      res.status(200).send(events.data);
    } else {
      console.log(events.message);
      throw new CustomError(500, result.message);
    }
  } catch (error) {
    next(error);
  }
}

async function createEvent(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    req.body.email = email;

    const result = await CreateEvent.addEvent(req.body);
    if (result.success) {
      console.log(result.data);
      res.status(201).json(result.data);
    } else {
      throw new CustomError(500, result.message);
    }
  } catch (error) {
    next(error);
  }
}

async function deleteEvent(req, res) {
  try {
    const eventCode = req.params.event_code;
    const result = await CreateEvent.deleteEvent(eventCode);
    if (result.success) {
      console.log(result.data);
      res.status(200).send(result.data);
    } else {
      console.log(result.message);
      throw new CustomError(500, result.message);
    }
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res) {
  try {
    const eventCode = req.params.event_code;
    const eventData = req.body;
    const result = await CreateEvent.updateEvent(eventCode, eventData);
    if (result.success) {
      console.log(result.data);
      res.status(200).send(result.data);
    } else {
      throw new CustomError(500, result.message);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEvent,
  getEventByEmail,
  getEventByinviteeEmail,
  getEventByEventCode,
  createEvent,
  deleteEvent,
  updateEvent
};
