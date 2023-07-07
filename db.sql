-- switch to drc database
\c drc;

-- drop any existing schema
DROP SCHEMA IF EXISTS ayo_drc_schema CASCADE;

-- create schema
CREATE SCHEMA IF NOT EXISTS ayo_drc_schema;

-- create table for user
CREATE TABLE ayo_drc_schema.tableuser (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    UNIQUE (email)
);

-- create table for creating event
CREATE TABLE ayo_drc_schema.tablecreateevent (
    event_id BIGSERIAL PRIMARY KEY NOT NULL,
    event_name VARCHAR(255),
    event_date DATE,
    event_time TIME,
    event_address VARCHAR(255),
    event_detail VARCHAR(255),
    event_rsvp_before_date DATE,
    event_rsvp_before_time TIME,
    event_code VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    UNIQUE (event_code),
    FOREIGN KEY (email) REFERENCES ayo_drc_schema.tableuser(email)
);

-- create table for invitee emails
CREATE TABLE ayo_drc_schema.tableinviteeemail (
    invitee_id BIGSERIAL PRIMARY KEY NOT NULL,
    event_code VARCHAR(255),
    invitee_email VARCHAR(255),
    FOREIGN KEY (event_code) REFERENCES ayo_drc_schema.tablecreateevent(event_code)
);

--create table for rsvp response
CREATE TABLE ayo_drc_schema.tablersvp (
    rsvp_id BIGSERIAL PRIMARY KEY NOT NULL,
    event_code VARCHAR(255) NOT NULL,
    rsvp_status VARCHAR(255),
    invitee_id BIGINT,
    UNIQUE (event_code, invitee_id),
    FOREIGN KEY (event_code) REFERENCES ayo_drc_schema.tablecreateevent(event_code),
    FOREIGN KEY (invitee_id) REFERENCES ayo_drc_schema.tableinviteeemail(invitee_id)
);