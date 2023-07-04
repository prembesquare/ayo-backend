const client = require("../db");

async function addRSVP({ event_code, rsvp_status, invitee_email }) {
  try {
    const resp = await client.query(
      "INSERT INTO ayo_drc_schema.tablersvp (event_code, rsvp_status, invitee_email) SELECT ayo_drc_schema.tablecreateevent.event_code, $1, $2 FROM ayo_drc_schema.tablecreateevent WHERE event_code = $3",
      [rsvp_status, invitee_email, event_code]
    );
    console.log("RSVP added successfully");
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
