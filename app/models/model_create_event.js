const client = require("../db");

async function getEvent() {
  const query = "SELECT * FROM ayo_drc_schema.tablecreateevent";

  let results;
  try {
    results = await client.query(query);
    return results.rows;
  } catch (e) {
    console.log("error");
    console.error(e);
    return undefined;
  }
}

async function getEventByEmail(eventId) {
  try {
    const query = "SELECT * FROM ayo_drc_schema.tablecreateevent WHERE email = $1";
    const resp = await client.query(query, [eventId]);
    return resp.rows[0];
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function addEvent({ event_name, event_date, event_time, event_address, event_detail, event_rsvp_before, email }) {
  try {
    const resp = await client.query(
      "INSERT INTO ayo_drc_schema.tablecreateevent (event_name, event_date, event_time, event_address, event_detail, event_rsvp_before, email) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [event_name, event_date, event_time, event_address, event_detail, event_rsvp_before, email]
    );
    return resp;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function deleteEvent(eventId) {
  try {
    const resp = await client.query(
      "DELETE FROM ayo_drc_schema.tablecreateevent WHERE id = $1",
      [eventId]
    );
    return resp;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function updateEvent(eventId, eventData) {
  try {
    const { event_name, event_date, event_time, event_address, event_detail, event_rsvp_before } = eventData;
    const resp = await client.query(
      "UPDATE ayo_drc_schema.tablecreateevent SET event_name = $1, event_date = $2, event_time = $3, event_address = $4, event_detail = $5, event_rsvp_before = $6 WHERE id = $7",
      [event_name, event_date, event_time, event_address, event_detail, event_rsvp_before, eventId,]
    );
    return resp;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

module.exports = { getEvent, getEventByEmail, addEvent, deleteEvent, updateEvent };
