const CreateEvent = require("../models/model_create_event");
const jwt = require('jsonwebtoken');

async function getEvent(req, res) {
  try {
    const events = await CreateEvent.getEvent();
    console.log(events);
    res.send(events);
  } catch (error) {
    console.error(error);
    res.render("error");
  }
}

async function getEventByEmail(req, res) {
  try {
    const email = req.params.email;
    const events = await CreateEvent.getEventByEmail(email);
    if (events.length > 0) {
      console.log("Events found:", events);
      res.send(events);
    } else {
      console.log("No events found");
      res.send("No events found");
    }
  } catch (error) {
    console.error(error);
    res.render("error");
  }
}

async function getEventByInvitedEmail(req, res) {
  try {
    const invitedEmail = req.params.invited_email;
    const events = await CreateEvent.getEventByInvitedEmail(invitedEmail);
    if (events.length > 0) {
      console.log("Events found:", events);
      res.send(events);
    } else {
      console.log("No events found");
      res.send("No events found");
    }
  } catch (error) {
    console.error(error);
    res.render("error");
  }
}

async function createEvent(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    req.body.email = email;

    const result = await CreateEvent.addEvent(req.body);
    if (result) {
      console.log("Event added successfully");
      res.send("Event added successfully");
    } else {
      console.log("Event addition failed");
      res.send("Event addition failed");
    }
  } catch (error) {
    console.error(error);
    res.render("error");
  }
}

async function deleteEvent(req, res) {
  try {
    const eventId = req.params.id;
    const result = await CreateEvent.deleteEvent(eventId);
    if (result) {
      console.log("Event deleted successfully");
      res.send("Event deleted successfully");
    } else {
      console.log("Event deletion failed");
      res.send("Event deletion failed");
    }
  } catch (error) {
    console.error(error);
    res.render("error");
  }
}

async function updateEvent(req, res) {
  try {
    const eventId = req.params.id;
    const eventData = req.body;
    const result = await CreateEvent.updateEvent(eventId, eventData);
    if (result) {
      console.log("Event updated successfully");
      res.send("Event updated successfully");
    } else {
      console.log("Event update failed");
      res.send("Event update failed");
    }
  } catch (error) {
    console.error(error);
    res.render("error");
  }
}

module.exports = {
  getEvent,
  getEventByEmail,
  getEventByInvitedEmail,
  createEvent,
  deleteEvent,
  updateEvent
};
