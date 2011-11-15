CREATE SCHEMA mineturer;


CREATE TABLE mineturer.users
(
  userid SERIAL NOT NULL,
  username character varying(50) NOT NULL,
  "password" character varying(50) NOT NULL,
  enabled boolean NOT NULL,
  email character varying(255),
  fullname character varying(255),
  flickrid character varying(50),
  CONSTRAINT pk_userid PRIMARY KEY (userid)
)
WITH (
  OIDS=FALSE
);



CREATE TABLE mineturer."userRoles"
(
  userid int NOT NULL,
  authority character varying(50) NOT NULL,
  CONSTRAINT pk_username_authority PRIMARY KEY (userid, authority),
  CONSTRAINT fk_userid FOREIGN KEY (userid)
      REFERENCES mineturer.users (userid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);


CREATE TABLE mineturer.trips(
tripid SERIAL  NOT NULL PRIMARY KEY,
userid int references mineturer.users(userid),
title varchar ,
description text ,
start timestamp ,
stop timestamp,
triptype varchar(50),
flickrtags varchar(255)
 );

CREATE TABLE mineturer.tracks(
trackid serial NOT NULL PRIMARY KEY,
tripid int references mineturer.trips (tripid) ON DELETE CASCADE
);
SELECT addGeometryColumn('mineturer','tracks','geom',4326,'GEOMETRY',2);

CREATE TABLE mineturer.routes(
routekid serial NOT NULL PRIMARY KEY,
tripid int references mineturer.trips (tripid) ON DELETE CASCADE
);
SELECT addGeometryColumn('mineturer','routes','geom',4326,'GEOMETRY',2);


CREATE TABLE mineturer.waypoints(
wpid serial NOT NULL PRIMARY KEY,
tripid int references mineturer.trips (tripid) ON DELETE CASCADE
);

SELECT addGeometryColumn('mineturer','waypoints','geom',4326,'GEOMETRY',2);

CREATE TABLE mineturer.points(
pid serial NOT NULL PRIMARY KEY,
tripid int references mineturer.trips (tripid) ON DELETE CASCADE,
ele DOUBLE PRECISION,
"time" timestamp,
hr DOUBLE PRECISION

);

SELECT addGeometryColumn('mineturer','points','geom',4326,'POINT',2);



ALTER TABLE mineturer.points ADD COLUMN segment integer default 0;

--ALTER TABLE mineturer.points ADD COLUMN hr double precision;
--ALTER TABLE mineturer.trips ADD COLUMN triptype varchar(50);
--ALTER TABLE mineturer.trips ADD COLUMN flickrtags varchar(255);