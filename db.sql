\c drc;
DROP TABLE IF EXISTS users;
CREATE SEQUENCE id_seq;
CREATE TABLE users (
    id integer NOT NULL DEFAULT nextval('id_seq'),
    firstName varchar(255),
    lastName varchar(255),
    email varchar(255),
    password varchar(255),
    PRIMARY KEY (id)
);