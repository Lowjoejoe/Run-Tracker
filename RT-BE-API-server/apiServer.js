//set dependencies 
const express = require('express');
const app = express();
const cors = require('cors');
const {Client} = require('pg');
const config = require ('./config.js')[process.env.NODE_ENV || "dev"]

const PORT = config.port 

const client = new Client ({
    connectionString: config.connectionString,
})

client.connect();

//set up middleware 
app.use(cors());
app.use(express.json());

//set up routes 

//initial blank test route 
app.get('/',(req,res)=>{
    res.send("Welcome to RunTracker.com")
})

//route to return all runners
app.get('/api/runners',(req,res,err)=>{
    client.query('SELECT * FROM runners')
    .then(results=>{
        res.status(200);
        res.send(results.rows);
    })
    .catch((err)=>console.log("error"));
});

//route to return all workouts 
app.get('/api/workouts',(req,res,err)=>{
    client.query('SELECT * FROM workouts')
    .then(results=>{
        res.status(200);
        res.send(results.rows);
    })
    .catch((err)=>console.log('error'));
});

//route to return inner join of runners and workouts 
app.get('/api/runners-workouts',(req,res,err)=>{
    client.query('SELECT name, distance, time, location, type FROM workouts INNER JOIN runners ON workouts.runner_id = runners.runner_id')
    .then(results=>{
        res.status(200);
        res.send(results.rows);
    })
    .catch((err)=>console.log('error'));
});

//route to get runners by ID
app.get('/api/runners/:id', (req,res,err)=>{
    client.query(`SELECT * FROM runners WHERE runner_id = ${req.params.id}`)
    .then(results=>{
        if(results.rows.length == 0){
            res.status(404);
            res.send(`Runner ID not found in database`);
            return;
        }
        res.status(200);
        res.send(results.rows)
    })
    .catch((err)=>console.log('error'))
});

//route to get workouts by ID 
app.get('/api/workouts/:id', (req,res,err)=>{
    client.query(`SELECT * FROM workouts WHERE workout_id = ${req.params.id}`)
    .then(results=>{
        if(results.rows.length == 0){
            res.status(404);
            res.send(`Workout ID not found in database`);
            return;
        }
        res.status(200);
        res.send(results.rows)
    })
    .catch((err)=>console.log('error'))
});

//route to get runners workouts by runner name
app.get('/api/runners-workouts/name/:name', (req,res,err)=>{
    client.query(`SELECT name, distance, time, location, type FROM workouts INNER JOIN runners ON workouts.runner_id = runners.runner_id WHERE name = '${req.params.name}'`)
    .then(results=>{
        if(results.rows.length == 0){
        res.status(404); 
        res.send(`Runner's name not found in database`);
        return;
        }
    res.status(200);
    res.send(results.rows);
    })
    .catch((err)=>console.log('error'));
});


//route to post new runner to database
app.post('/api/runners', (req,res)=>{
    let newRunner=req.body;
    if (newRunner.name && newRunner.name !=0 && typeof newRunner.age == 'number' && newRunner.age !=0){
        client.query(`INSERT INTO runners (name, age) VALUES ('${newRunner.name}', ${newRunner.age})`,
        (err)=>{
            if(err){
            console.log(err);
        }else{
            let newRunnerString = JSON.stringify(newRunner);
            res.status(200);
            res.send(`Runner information added to database: ${newRunnerString}`);
            }
        });
    }else{
        res.status(404);
        res.send(`404 ERROR: Bad patch request please provide Runner's: name|age`)
    }
});
 
//route to post new workout to database
app.post('/api/workouts', (req,res)=>{
    let newWorkout = req.body;
    if(newWorkout.runner_id && newWorkout.distance && newWorkout.time && newWorkout.location && newWorkout.type && typeof newWorkout.runner_id == 'number' && typeof newWorkout.distance == 'number' && newWorkout.time.length !=0 && newWorkout.location.length !=0 && newWorkout.type.length !=0){
        client.query(`INSERT INTO workouts (runner_id, distance, time, location, type) VALUES (${newWorkout.runner_id},${newWorkout.distance},'${newWorkout.time}','${newWorkout.location}','${newWorkout.type}')`,
        (err)=>{
            if(err){
            console.log(err);
        }else{
            let newWorkoutString = JSON.stringify(newWorkout);
            res.status(200);
            res.send(`workout information added to database: ${newWorkoutString}`);
            }
        });
    }else{
        res.status(404);
        res.send(`404 ERROR: Bad patch request please provide workout: runner_id|distance as number|time|location|type`);
    }
});


//route to delete workout from database by id 
app.delete('/api/workouts/:id', (req,res)=>{
    client.query(`SELECT * FROM workouts WHERE workout_id = ${req.params.id}`)
    .then(results=>{
        if (results.rows.length == 0){
            res.status(404);
            res.send(`workout doesn't exist in the database`);
            return;
        }else{
            let deletedWorkout = JSON.stringify(results.rows);
            res.status(200);
            res.send(`Workout data deleted from database ${deletedWorkout}`);
            client.query(`DELETE FROM workouts WHERE id = ${req.params.id}`);
        }
    })
});

//route to delete runner from database by name
app.delete('/api/runners/:name', (req,res)=>{
    client.query(`SELECT * FROM runners WHERE name = '${req.params.id}'`)
    .then(results=>{
        if (results.rows.length == 0){
            res.status(404);
            res.send(`Runner doesn't exist in the database`);
            return;
        }else{
            let deletedRunner = JSON.stringify(results.rows);
            res.status(200);
            res.send(`Runner data deleted from database ${deletedRunner}`);
            client.query(`DELETE FROM runners WHERE name = '${req.params.id}'`);
        }
    })
});

//route to patch workout in database by id 
app.patch('/api/workouts/:id',(req,res)=>{
    let workoutUpdate = req.body;
    if(workoutUpdate.distance && workoutUpdate.time && workoutUpdate.location && workoutUpdate.type && typeof workoutUpdate.distance == 'number'&& workoutUpdate.distance.length !=0 && workoutUpdate.time.length !=0 && workoutUpdate.location.length !=0 && workoutUpdate.type.length !=0){
        client.query(`UPDATE workouts SET distance = ${workoutUpdate.distance}, time = '${workoutUpdate.time}', location = '${workoutUpdate.location}', type = '${workoutUpdate.type}'WHERE workout_id = ${req.params.id}`)
        .then(results=>{
            res.status(200);
            let workoutUpdateString = JSON.stringify(workoutUpdate);
            res.send(`Workout at ID: ${req.params.id} updated to: ${workoutUpdateString}`);
        })
    }else{
        res.status(404);
        res.send(`404 ERROR: Bad patch request please provide workout: distance as number |time|location|type`);
    }
});


//set up listen on port
app.listen(PORT,()=>{
    console.log(`server is running on PORT: ${PORT}`);
});