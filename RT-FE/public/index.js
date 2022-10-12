const ENV = "dev";
//const ENV = "production";

var workoutResultArea = document.querySelector('.workouts');
var runnerResultArea = document.querySelector('.runners');
let searchInputField = document.querySelector('.search');

let ApiUrl = ENV == "dev" ? 'http://localhost:3000': 'fill in with website that you deploy from';
console.log('API:', ApiUrl);


//set up fetch from API
function pullAPIdata(){
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
    searchInputField.value = "search by runner";
});

//
pullAPIdata();