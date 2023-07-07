const client = require("../db");

async function addRSVP({ event_code, rsvp_status, invitee_email }) {
  try {
    const inviteeQuery = "SELECT e.invitee_id FROM (SELECT * FROM ayo_drc_schema.tableinviteeemail WHERE event_code = $1) AS e where e.invitee_email = $2;";
    const inviteeResult = await client.query(inviteeQuery, [event_code, invitee_email]);
    const invitee_id = inviteeResult.rows[0].invitee_id;

    // Insert RSVP record
    const resp = await client.query(
      "INSERT INTO ayo_drc_schema.tablersvp (event_code, rsvp_status, invitee_id) VALUES ($1, $2, $3)",
      [event_code, rsvp_status, invitee_id]
    );

    console.log("RSVP added successfully");
    console.log("pass", event_code, rsvp_status, invitee_id);
    return resp;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}


async function getRSVPByStatus(rsvpStatus) {
  try {
    const query =
      "SELECT * FROM ayo_drc_schema.tablersvp WHERE rsvp_status = $1";
    const resp = await client.query(query, [rsvpStatus]);
    return resp.rows;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

module.exports = { addRSVP, getRSVPByStatus };
