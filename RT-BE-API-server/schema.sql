DROP TABLE IF EXISTS runners CASCADE;

CREATE TABLE runners (
  runner_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name varchar(255) 
);

DROP TABLE IF EXISTS workouts CASCADE;

CREATE TABLE workouts (
  workout_id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  runner_id integer REFERENCES runners ON DELETE CASCADE,
  distance integer,
  time varchar(255),
  location varchar(255),
  type varchar(255)
 
);

INSERT INTO runners (name)
VALUES
  ('Scarlet Patterson'),
  ('Drake Levine'),
  ('Tanner Hunter'),
  ('Cora Rodriguez'),
  ('Katelyn Armstrong');

INSERT INTO workouts (runner_id,distance,time,location,type)
VALUES
  (1,8,'49:41','Point Defiance Park','trail'),
  (2,24,'3:54:30','Tacoma, WA','distance'),
  (3,12,'1:10:1','Dupont, WA','road'),
  (2,6,'41:31','Lakewood, WA','intervals'),
  (4,2,'20:49','Solo Point','hills');

