-- switch to drc database
\c drc;

-- drop any existing schema
DROP SCHEMA IF EXISTS ayo_drc_schema CASCADE;

-- create schema
CREATE SCHEMA IF NOT EXISTS ayo_drc_schema;

-- create table for register
CREATE TABLE ayo_drc_schema.tableRegister (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    UNIQUE (email)
);

--create table for creating event
CREATE TABLE ayo_drc_schema.tablecreateevent (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    event_name VARCHAR(255),
    event_date DATE,
    event_time TIME,
    event_address VARCHAR(255),
    event_detail VARCHAR(255),
    event_rsvp_before DATE,
    email VARCHAR(255) NOT NULL
);


