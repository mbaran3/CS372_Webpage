const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/webpage2")
.then(()=>{
    console.log("mongo conncted")
})
.catch(()=>{
    console.log("Failed to connected")
})

const loginInScheme = new mongoose.Schema({
    UserID:{
        type: String,
        require: true,
        unique: true
    },
    Password:{
        type: String,
        required: true
    },
    role:{
        type: String
    }
})

const db = new mongoose.model("UserData", loginInScheme)

module.exports = db