
DROP TABLE trips.trips;
DROP TABLE trips.tracks;
DROP TABLE trips.waypoints;
DROP TABLE trips.routes;

CREATE TABLE trips.trips (
tripid SERIAL  NOT NULL PRIMARY KEY,
userid int ,
title varchar ,
description text ,
start timestamp ,
stop timestamp );

CREATE TABLE trips.tracks(
trackid serial NOT NULL PRIMARY KEY,
tripid int references trips.trips(tripid) ON DELETE CASCADE
);
SELECT addGeometryColumn('trips','tracks','geom',4326,'GEOMETRY',2);

CREATE TABLE trips.routes(
routekid serial NOT NULL PRIMARY KEY,
tripid int references trips.trips(tripid) ON DELETE CASCADE
);
SELECT addGeometryColumn('trips','routes','geom',4326,'GEOMETRY',2);


CREATE TABLE trips.waypoints(
wpid serial NOT NULL PRIMARY KEY,
tripid int references trips.trips(tripid) ON DELETE CASCADE
);

SELECT addGeometryColumn('trips','waypoints','geom',4326,'GEOMETRY',2);

CREATE TABLE trips.points(
pid serial NOT NULL PRIMARY KEY,
tripid int references trips.trips(tripid) ON DELETE CASCADE,
ele double,
"time" timestamp

);

SELECT addGeometryColumn('trips','points','geom',4326,'POINT',2);



INSERT INTO trips.trips(userid,title,description) VALUES (1,'Trip 2', 'Lang beskrivelse her)');

INSERT INTO trips.tracks(tripid,geom) VALUES (2,ST_GeomFromEWKT('SRID=4326;MULTILINESTRING((10.0 60.1 0 1, 10.1 60.0 0 1,10.2 60.2 0 1,10.3 60.3 0 1,10.4 60.4 0 1))'));

INSERT INTO trips.waypoints(tripid,geom) VALUES (1,ST_GeomFromEWKT('SRID=4326;POINT(10.0 60.1 0 1)'));