const client = require("../db");
const nodemailer = require('nodemailer');

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
      "SELECT * FROM ayo_drc_schema.tablecreateevent JOIN ayo_drc_schema.tableinviteeemail ON tablecreateevent.event_code = tableinviteeemail.event_code WHERE tableinviteeemail.invitee_email = $1";
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
  event_rsvp_before_date,
  event_rsvp_before_time,
  event_code,
  invitee_email,
  email,
}) {
  
  const eventDateTime = new Date(`${event_date}T${event_time}`);
  const rsvpDeadlineDateTime = new Date(`${event_rsvp_before_date}T${event_rsvp_before_time}`);
  
  if (rsvpDeadlineDateTime > eventDateTime) {
    throw new Error("RSVP deadline cannot be later than event date and time");
  }

  let eventId;
  try {
    await client.query("BEGIN");

    const insertEventQuery =
      "INSERT INTO ayo_drc_schema.tablecreateevent (event_name, event_date, event_time, event_address, event_detail, event_rsvp_before_date, event_rsvp_before_time, event_code, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING event_code";
    const eventValues = [
      event_name,
      event_date,
      event_time,
      event_address,
      event_detail,
      event_rsvp_before_date,
      event_rsvp_before_time,
      event_code,
      email,
    ];
    const eventResult = await client.query(insertEventQuery, eventValues);

    eventCode = eventResult.rows[0].event_code;

    if (invitee_email && invitee_email.length > 0) {
      const insertinviteeEmailQuery =
        "INSERT INTO ayo_drc_schema.tableinviteeemail (event_code, invitee_email) VALUES ($1, $2)";
      const inviteeEmailValues = invitee_email.map((email) => [eventCode, email]);
      await Promise.all(
        inviteeEmailValues.map((values) =>
          client.query(insertinviteeEmailQuery, values)
        )
      );

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "ayoevents12@gmail.com",
          pass: "zvtnlzqbugvqhumj",
        },
      });

      const mailOptions = {
        from: 'ayoevents12@gmail.com',
        subject: 'You have been invited to an event',
        html: `<p>You have been invited to the event ${event_name}. Click <a href="http://your-app.com/events/${eventCode}">here</a> to view the event.</p>`
      };

      const sendInvitationEmails = invitee_email.map((email) => {
        mailOptions.to = email;
        return transporter.sendMail(mailOptions);
      });
  
      await Promise.all(sendInvitationEmails);
    }

    await client.query("COMMIT");

    return { event_id: eventId };
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return undefined;
  }
}

async function deleteEvent(eventCode) {
  try {
    await client.query('BEGIN');

    const deleteRsvpQuery =
      'DELETE FROM ayo_drc_schema.tablersvp WHERE event_code = $1';
    await client.query(deleteRsvpQuery, [eventCode]);

    const deleteInviteeEmailQuery =
      'DELETE FROM ayo_drc_schema.tableinviteeemail WHERE event_code = $1';
    const deleteInviteeEmailResult = await client.query(
      deleteInviteeEmailQuery,
      [eventCode]
    );

    const deleteEventQuery =
      'DELETE FROM ayo_drc_schema.tablecreateevent WHERE event_code = $1';
    const deleteEventResult = await client.query(deleteEventQuery, [eventCode]);

    await client.query('COMMIT');

    if (
      deleteInviteeEmailResult.rowCount === 0 &&
      deleteEventResult.rowCount === 0
    ) {
      return false;
    }

    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    return undefined;
  } finally {
    await client.query('END');
  }
}

async function updateEvent(eventCode, eventData) {
  try {
    const {
      event_name,
      event_date,
      event_time,
      event_address,
      event_detail,
      event_rsvp_before_date,
      event_rsvp_before_time,
    } = eventData;

    await client.query('BEGIN');

    const updateEventQuery =
      'UPDATE ayo_drc_schema.tablecreateevent SET event_name = $1, event_date = $2, event_time = $3, event_address = $4, event_detail = $5, event_rsvp_before_date = $6, event_rsvp_before_time = $7 WHERE event_code = $8';
    const eventValues = [
      event_name,
      event_date,
      event_time,
      event_address,
      event_detail,
      event_rsvp_before_date,
      event_rsvp_before_time,
      eventCode,
    ];
    await client.query(updateEventQuery, eventValues);

    if (eventData.invitee_email && eventData.invitee_email.length > 0) {
      const insertInviteeEmailQuery =
        'INSERT INTO ayo_drc_schema.tableinviteeemail (event_code, invitee_email) VALUES ($1, $2)';
      const inviteeEmailValues = eventData.invitee_email.map((email) => [
        eventCode,
        email,
      ]);
      await Promise.all(
        inviteeEmailValues.map((values) =>
          client.query(insertInviteeEmailQuery, values)
        )
      );
    }

    await client.query('COMMIT');

    return { event_code: eventCode };
  } catch (e) {
    await client.query('ROLLBACK');
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
