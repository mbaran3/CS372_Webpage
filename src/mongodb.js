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
const ContentScheme = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    discription:{
        type: String,
        require: false,
        unique: false
    }
})


const Users = new mongoose.model("Users", loginInScheme)
const Content = new mongoose.model("Content", ContentScheme)

module.exports = db = {
    Users: Users,
    Content: Content
}