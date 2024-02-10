require("../db")
const axios =  require("axios");
const Exercise = require("../models/Exercise.model");
const capitalize = require("../utils/capitalize");


const options = {
    method: 'GET',
    url: 'https://exercisedb.p.rapidapi.com/exercises',
    params: {limit: '1300'},
    headers: {
        'X-RapidAPI-Key': process.env.API_KEY_EX,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
};

axios.request(options)
.then((response)=>{
    response.data.forEach((ex)=>{

        if(!(ex.bodyPart == "cardio") && !(ex.bodyPart == "neck")){
            const exercise = {
                equipment: ex.equipment,
                id: ex.id,
                target: ex.target,
                secondaryMuscles: ex.secondaryMuscles,
                instructions: ex.instructions
            }

            exercise.name = capitalize(ex.name);
    
            if(ex.bodyPart == "upper legs" || ex.bodyPart == "lower legs"){
                exercise.bodyPart = "legs";
            }
            else if(ex.bodyPart == "upper arms" || ex.bodyPart == "lower arms"){
                exercise.bodyPart = "arms";
            }
            else if(ex.bodyPart == "shoulders"){
                exercise.bodyPart = "shoulders";
            }
            else if(ex.bodyPart == "back"){
                exercise.bodyPart = "back";
            }
            else if(ex.bodyPart == "waist"){
                exercise.bodyPart = "waist";
            }
            else if(ex.bodyPart == "chest"){
                exercise.bodyPart = "chest";
            }
            
            Exercise.create(exercise)
        }
    })
})