const client = require("../db");
const CustomError = require('../middleware/CustomError');

async function addRSVP({ event_code, rsvp_status, invitee_email }) {
  try {
    const inviteeQuery = "SELECT e.invitee_id FROM (SELECT * FROM ayo_drc_schema.tableinviteeemail WHERE event_code = $1) AS e where e.invitee_email = $2;";
    const inviteeResult = await client.query(inviteeQuery, [event_code, invitee_email]);
    const invitee_id = inviteeResult.rows[0].invitee_id;

    // Check if the user has already RSVP
    const rsvpCheckQuery = "SELECT * FROM ayo_drc_schema.tablersvp WHERE event_code = $1 AND invitee_id = $2";
    const rsvpCheckResult = await client.query(rsvpCheckQuery, [event_code, invitee_id]);

    if (rsvpCheckResult.rowCount > 0) {
      throw new CustomError(400, "User has already RSVPed for this event");
    }

    // Insert RSVP record
    const resp = await client.query(
      "INSERT INTO ayo_drc_schema.tablersvp (event_code, rsvp_status, invitee_id) VALUES ($1, $2, $3)",
      [event_code, rsvp_status, invitee_id]
    );

    console.log("RSVP added successfully");
    console.log("pass", event_code, rsvp_status, invitee_id);
    return { success: true, message: "RSVP added successfully" };
  } catch (e) {
    console.error(e);
    throw new CustomError(500, "Failed to add RSVP");
  }
}

async function getRSVPByStatus(rsvpStatus) {
  try {
    const query =
      "SELECT * FROM ayo_drc_schema.tablersvp WHERE rsvp_status = $1";
    const resp = await client.query(query, [rsvpStatus]);
    return { success: true, data: resp.rows };
  } catch (e) {
    console.error(e);
    throw new CustomError(500, "Failed to get RSVPs");
  }
}

async function getYesStatus(event_code) {
  try {
    const query = `
      SELECT t2.invitee_email
      FROM ayo_drc_schema.tablersvp AS t1
      JOIN ayo_drc_schema.tableinviteeemail AS t2 ON t1.invitee_id = t2.invitee_id
      WHERE t1.event_code = $1 AND t1.rsvp_status = 'Yes'`;
    const resp = await client.query(query, [event_code]);
    return { success: true, data: resp.rows };
  } catch (e) {
    console.error(e);
    throw new CustomError(500, "Failed to get RSVPs"); 
  }
}

async function getNoStatus(event_code) {
  try {
    const query = `
      SELECT t2.invitee_email
      FROM ayo_drc_schema.tablersvp AS t1
      JOIN ayo_drc_schema.tableinviteeemail AS t2 ON t1.invitee_id = t2.invitee_id
      WHERE t1.event_code = $1 AND t1.rsvp_status = 'No'`;
    const resp = await client.query(query, [event_code]);
    return { success: true, data: resp.rows };
  } catch (e) {
    console.error(e);
    throw new CustomError(500, "Failed to get RSVPs"); 
  }
}

module.exports = { addRSVP, getRSVPByStatus, getYesStatus, getNoStatus };
