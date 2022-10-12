const ENV = "dev";
//const ENV = "production";

var workoutResultArea = document.querySelector('.workouts');
var runnerResultArea = document.querySelector('.runners');
let registeredRunners = document.querySelector('.registered_runners');

let ApiUrl = ENV == "dev" ? 'http://localhost:3000': 'fill in with website that you deploy from';
console.log('API:', ApiUrl);

//function to pull initial data from API to FE website
function initialSetup(){
    pullRunnerAPIdata();
    pullWorkoutAPIdata();
}

//function to fetch all runners 
function pullRunnerAPIdata(){
    fetch(`${ApiUrl}/api/runners`,{
        method: 'GET',
        mode:'cors',
        headers:{'Content-type':'application/json'}
    })
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        for(let i = 0; i<data.length; i++){
        var runnerElement = document.createElement('li');
        runnerElement.innerHTML = `${data[i].name}, age:${data[i].age}`;
        registeredRunners.appendChild(runnerElement);
        }
    })
    .catch(err=>console.log(err));
}

//set up fetch from API for workouts 
function pullWorkoutAPIdata(){
    fetch(`${ApiUrl}/api/runners-workouts`,{
        method:'GET',
        mode:'cors',
        headers:{'Content-type':'application/json'}
    })
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        addResultsToDOM(data,workoutResultArea);
    })
    .catch(err=>console.log(err));
}

//add data to the DOM
function addResultsToDOM(data,DOMelement){
    for(let i = 0; i<data.length; i++){
        var workoutDiv = document.createElement('li');
        workoutDiv.innerHTML = `${data[i].name}, ${data[i].distance} miles, ${data[i].time}, ${data[i].location}, ${data[i].type}`;
        DOMelement.appendChild(workoutDiv);
    }
}

//event listener to search for workouts by runner
document.querySelector("#search_button").addEventListener("click", ()=>{
    $('.runners').empty();
    let runnerSearch = document.querySelector('.search').value;
    fetch(`${ApiUrl}/api/runners-workouts/name/${runnerSearch}`,{
        method:'GET',
        mode:'cors',
        headers:{'Content-type':'application/json'},
    })
    .then((response)=>response.json())
    .then((data)=>{
        console.log(data);
        addResultsToDOM(data,runnerResultArea);
    })
    .catch(err=>console.log(err));
});

//event listener to add a new runner to the database
document.querySelector("#runner_button").addEventListener("click",()=>{
    let runnerName = document.querySelector('.name').value;
    let runnerAge= document.querySelector('.age').value;

    let newRunner ={
        'name': runnerName,
        'age': Number(runnerAge)
    }
    console.log(newRunner);
    if (runnerName == '' && runnerAge ==''){
        console.log('error need to fill input fields');
    }else{
        fetch(`${ApiUrl}/api/runners`, {
            method:'POST',
            mode: 'cors',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newRunner)
        })
        .then(response=>{
            if(response.status == 200){
                var runnerElement = document.createElement('li');
                runnerElement.innerHTML = `${newRunner.name}, ${newRunner.age}`;
                registeredRunners.appendChild(runnerElement);
            }else{
                alert("something went wrong!",response);
            }
        })
    }
})


//event listener to add new workout to the data base 
document.querySelector("#workout_button").addEventListener("click",()=>{
    let runnerId= document.querySelector('.runner_id').value;
    let workoutDistance = document.querySelector('.distance').value;
    let workoutTime=document.querySelector('.time').value;
    let workoutLocation= document.querySelector('.location').value;
    let workoutType= document.querySelector('.type').value;

    let newWorkout= {
        'runner_Id': Number(runnerId),
        'distance': Number(workoutDistance),
        'time': workoutTime,
        'location': workoutLocation,
        'type':workoutType
    }
    console.log(newWorkout);
    if (runnerId== '' && workoutDistance =='' && workoutTime =='' && workoutLocation =='' && workoutType ==''){
        console.log('error need to fill input fields');
    }else{
        fetch(`${ApiUrl}/api/workouts`, {
            method:'POST',
            mode: 'cors',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newWorkout)
        })
        .then(response=>{
            if(response.status == 200){
                pullWorkoutAPIdata();
            }else{
                alert("something went wrong!",response);
            }
        })
    }
})

//event listner to delete runners from the database 
document.querySelector("#delete_runner_button").addEventListener("click",()=>{
    let runnerName = document.querySelector('.name').value;
   
    let newRunner ={
        'name': runnerName,
    }
    console.log(newRunner);
    if (runnerName == ''){
        console.log('error need to fill input fields');
    }else{
        fetch(`${ApiUrl}/api/runners/:name`, {
            method:'DELETE',
            mode: 'cors',
            headers: {'Content-Type':'application/json'},
        })
        .then(response=>{
            if(response.status == 200){
                alert(`successfully deleted ${runnerName} from the database`)
            }else{
                alert("something went wrong!",response);
            }
        })
    }
})

//
initialSetup();