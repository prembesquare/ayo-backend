const client = require("../db");

async function getEvent() {
  const query = "SELECT * FROM ayo_drc_schema.tablecreateevent";

  let results;
  try {
    results = await client.query(query);
    return results.rows;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function getEventByEmail(eventId) {
  try {
    const query =
      "SELECT * FROM ayo_drc_schema.tablecreateevent WHERE email = $1";
    const resp = await client.query(query, [eventId]);
    return resp.rows;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function getEventByinviteeEmail(inviteeEmail) {
  try {
    const query =
      "SELECT * FROM ayo_drc_schema.tablecreateevent JOIN ayo_drc_schema.tableinviteeemail ON tablecreateevent.event_id = tableinviteeemail.event_id WHERE tableinviteeemail.invitee_email = $1";
    const resp = await client.query(query, [inviteeEmail]);
    return resp.rows;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function addEvent({
  event_name,
  event_date,
  event_time,
  event_address,
  event_detail,
  event_rsvp_before,
  event_code,
  invitee_email,
  email,
}) {
  let eventId;
  try {
    await client.query("BEGIN");

    const insertEventQuery =
      "INSERT INTO ayo_drc_schema.tablecreateevent (event_name, event_date, event_time, event_address, event_detail, event_rsvp_before, event_code, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id";
    const eventValues = [
      event_name,
      event_date,
      event_time,
      event_address,
      event_detail,
      event_rsvp_before,
      event_code,
      email,
    ];
    const eventResult = await client.query(insertEventQuery, eventValues);

    eventId = eventResult.rows[0].event_id;

    if (invitee_email && invitee_email.length > 0) {
      const insertinviteeEmailQuery =
        "INSERT INTO ayo_drc_schema.tableinviteeemail (event_id, invitee_email) VALUES ($1, $2)";
      const inviteeEmailValues = invitee_email.map((email) => [eventId, email]);
      await Promise.all(
        inviteeEmailValues.map((values) =>
          client.query(insertinviteeEmailQuery, values)
        )
      );
    }

    await client.query("COMMIT");

    return { event_id: eventId };
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return undefined;
  }
}

async function deleteEvent(eventId) {
  try {
    const deleteinviteeEmailQuery =
      "DELETE FROM ayo_drc_schema.tableinviteeemail WHERE event_id = $1";
    await client.query(deleteinviteeEmailQuery, [eventId]);

    const deleteEventQuery =
      "DELETE FROM ayo_drc_schema.tablecreateevent WHERE event_id = $1";
    const resp = await client.query(deleteEventQuery, [eventId]);

    return resp;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function updateEvent(eventId, eventData) {
  try {
    const {
      event_name,
      event_date,
      event_time,
      event_address,
      event_detail,
      event_rsvp_before,
      event_code,
    } = eventData;
    await client.query("BEGIN");

    const updateEventQuery =
      "UPDATE ayo_drc_schema.tablecreateevent SET event_name = $1, event_date = $2, event_time = $3, event_address = $4, event_detail = $5, event_rsvp_before = $6, event_code = $7 WHERE event_id = $8";
    const eventValues = [
      event_name,
      event_date,
      event_time,
      event_address,
      event_detail,
      event_rsvp_before,
      event_code,
      eventId,
    ];
    await client.query(updateEventQuery, eventValues);

    if (eventData.invitee_email) {
      const deleteinviteeEmailQuery =
        "DELETE FROM ayo_drc_schema.tableinviteeemail WHERE event_id = $1";
      await client.query(deleteinviteeEmailQuery, [eventId]);

      const insertinviteeEmailQuery =
        "INSERT INTO ayo_drc_schema.tableinviteeemail (event_id, invitee_email) VALUES ($1, $2)";
      const inviteeEmailValues = eventData.invitee_email.map((email) => [
        eventId,
        email,
      ]);
      await Promise.all(
        inviteeEmailValues.map((values) =>
          client.query(insertinviteeEmailQuery, values)
        )
      );
    }

    await client.query("COMMIT");

    return { event_id: eventId };
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return undefined;
  }
}

module.exports = {
  getEvent,
  getEventByEmail,
  getEventByinviteeEmail,
  addEvent,
  deleteEvent,
  updateEvent,
};
