require("../db")
const axios =  require("axios");
const Exercise = require("../models/Exercise.model");


const options = {
    method: 'GET',
    url: 'https://exercisedb.p.rapidapi.com/exercises',
    params: {limit: '50'},
    headers: {
        'X-RapidAPI-Key': process.env.API_KEY_EX,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
};

axios.request(options)
.then((response)=>{
    response.data.forEach((ex)=>{
        Exercise.create({
            bodyPart: ex.bodyPart,
            equipment: ex.equipment,
            giftUrl: ex.giftUrl,
            id: ex.id,
            name: ex.name,
            target: ex.target,
            secondaryMuscles: ex.secondaryMuscles,
            instructions: ex.instructions
        })
    });
})

