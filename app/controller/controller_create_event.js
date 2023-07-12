const CreateEvent = require("../models/model_create_event");
const jwt = require("jsonwebtoken");

async function getEvent(req, res) {
  try {
    const events = await CreateEvent.getEvent();
    console.log(events);
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getEventByEmail(req, res) {
  try {
    const email = req.params.email;
    const events = await CreateEvent.getEventByEmail(email);
    if (events.length > 0) {
      console.log("Events found:", events);
      res.status(200).json(events);
    } else {
      console.log("No events found");
      res.status(404).json({ message: "No events found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getEventByinviteeEmail(req, res) {
  try {
    const inviteeEmail = req.params.invitee_email;
    const events = await CreateEvent.getEventByinviteeEmail(inviteeEmail);
    if (events.length > 0) {
      console.log("Events found:", events);
      res.status(200).json(events);
    } else {
      console.log("No events found");
      res.status(404).json({ message: "No events found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getEventByEventCode(req, res) {
  const eventCode = req.params.event_code;
  const events = await CreateEvent.getEventByEventCode(eventCode);
  try {
    const eventCode = await CreateEvent.getEventByEventCode();
    console.log(events);
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
      res.status(201).json({ message: "Event added successfully" });
    } else {
      console.log("Event addition failed");
      res.status(500).json({ error: "Event addition failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteEvent(req, res) {
  try {
    const eventCode = req.params.event_code;
    const result = await CreateEvent.deleteEvent(eventCode);
    if (result) {
      console.log("Event deleted successfully");
      res.status(200).json({ message: "Event deleted successfully" });
    } else {
      console.log("Event deletion failed");
      res.status(500).json({ error: "Event deletion failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateEvent(req, res) {
  try {
    const eventCode = req.params.event_code;
    const eventData = req.body;
    const result = await CreateEvent.updateEvent(eventCode, eventData);
    if (result) {
      console.log("Event updated successfully");
      res.status(200).json({ message: "Event updated successfully" });
    } else {
      console.log("Event update failed");
      res.status(500).json({ error: "Event update failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
