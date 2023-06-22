const CreateEvent = require ("../models/model_create_event");
const jwt = require('jsonwebtoken');

async function getEvent(req, res) {
    let getCreateEvent = await CreateEvent.getEvent();
    console.log(getCreateEvent);
    res.send(getCreateEvent);
  }

  async function getEventByEmail(req, res) {
    try {
      const email = req.params.email;
      const event = await CreateEvent.getEventByEmail(email);
      if (event) {
        console.log("Event found:", event);
        res.send(event);
      } else {
        console.log("Event not found");
        res.send("Event not found");
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

    console.log("trial");
    console.log(email);
    let addCreateEvent = await CreateEvent.addEvent(req.body);
    console.log("try")
    console.log(req.body);
    res.send("Added successfully");
  } catch (error) {
    res.render("error");
  }
}

async function deleteEvent(req, res) {
    try {
      const eventId = req.params.id;
      const deleteEvent = await CreateEvent.deleteEvent(eventId);
      if (deleteEvent) {
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
      const updateEvent = await CreateEvent.updateEvent(eventId, eventData);
      if (updateEvent) {
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

module.exports = {getEvent, getEventByEmail, createEvent, deleteEvent, updateEvent}