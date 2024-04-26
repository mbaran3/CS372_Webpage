const mongoose = require("mongoose")
const dotenv = require('dotenv').config()


mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
    console.log("mongo conncted")
})
.catch((err)=>{
    console.log("mongo failed to connect")
    console.log(err)
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
        type: String,
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
    },
    link:{
        type: String,
        require: true
    },
    likes:[String],
    views:{
        type: Number,
        default: 0
    },
    comment:[]
    

})


const Users = new mongoose.model("Users", loginInScheme)
const Content = new mongoose.model("Content", ContentScheme)

module.exports = db = {
    Users: Users,
    Content: Content
}
