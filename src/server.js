const express = require("express")
const validateRegistatoin = require('./registrationvalidation')
const path = require("path")
const app = express()
const bcrypt = require("bcrypt")
const port = 8080
const db = require("./mongodb")
const passport = require("passport")
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const viewsPath = path.join(__dirname, '/views')

const initializePassport = require("./passport-config")
const { name } = require("ejs")
const { isContext } = require("vm")
const { rmSync } = require("fs")
const { url } = require("inspector")
initializePassport(passport, 
    async UserID => {
        const user = await db.Users.findOne({UserID: UserID})
        return user
    }, async getdbID => {
        const user = await db.Users.findOne({UserID: UserID})
        return user._id
    })

app.set(`view engine`, `ejs`)
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.set("views", viewsPath)
app.use(flash())
app.use(session({
    secret: 'secret code',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', checkAuthenticated, async(req, res) =>{
    videos = await db.Content.find({})
    res.render('index.ejs', videos)
})
app.get('/editUser', checkAuthenticated, (req, res)=>{
    res.render('index.ejs')
})
app.get('/login', checkNotAuthenticated, (req, res) =>{
    res.render('login.ejs')
})
app.get('/register', checkNotAuthenticated, (req, res) =>{
    res.render('register.ejs', {message: ""})
})

app.post('/editUser', checkAuthenticated,  async (req, res)=>{
    const userEdit = await db.Users.findOneAndUpdate({UserID: req.body.UserID}, {role: req.body.Role})
    if (userEdit != null){
        console.log("User was changed")
    }
    res.redirect('/')
})
app.get('/manageVideo', checkAuthenticated, async (req, res)=>{
    res.render('manageVideo.ejs')
})
app.get('/addVideo', checkAuthenticated, (req, res)=>{
    res.render('addVideo.ejs')
})

app.get('/editVideo', checkAuthenticated, (req, res)=>{
    res.render('editVideo.ejs')
})
app.post('/editVideo', checkAuthenticated, async (req, res)=>{
    const video = await db.Content.findOne({name: req.body.name})
    if(req.body.newLink == null){
        req.body.newLink = video.link
    }
    if(req.body.newName == null){
        req.body.newName = video.name
    }
    if(req.body.newDiscription == null){
        req.body.newDiscription = video.discription
    }
    const editVideo = await db.Content.findOneAndUpdate({name: req.body.name},
                    {
                        name: req.body.newName,
                        discription: req.body.newDiscription,
                        link: createLink(req.body.newLink)
                    })
    if(editVideo != null){
        console.log("video was changed")
    }

    res.redirect('/')
})

app.post('/addVideo', checkAuthenticated, async(req, res)=>{

    const data = {
        name: req.body.videoName,
        discription: req.body.videoDescription,
        link: createLink(req.body.videoLink),
    }
    console.log(req.body.videoDescription)
    console.log(data)
    try{
        newContent = await db.Content.insertMany([data])
        console.log(newContent)
        res.redirect('/')
    }
    catch{
        console.log("error adding content")
    }
})       

app.post('/register', checkNotAuthenticated, async(req, res)=>{
    
    checkPass = validateRegistatoin.checkPassword(req.body.Password)
    checkUserID = validateRegistatoin.checkUserID(req.body.UserID)
    
    if(checkPass.isValid && checkUserID.isValid){
        try{
            const hashedPassword = await bcrypt.hash(req.body.Password, 10)
            if(await db.Users.countDocuments() == 0){
                data = {
                    UserID: req.body.UserID,
                    Password: hashedPassword,
                    role: "Admin"
                }               
            }else{
                data = {
                    UserID: req.body.UserID,
                    Password: hashedPassword,
                    role: "Viewer"
                }
            }
            
            await db.Users.insertMany([data])
            res.redirect('/login')
            console.log("added User")
        }
        catch{
            res.render('register.ejs', {message: "UserID was already taken."})
        }
    }
    else{
        if(!checkPass.isValid)
            res.render('register.ejs', {message: checkPass.message})
        else
            res.render('register.ejs', {message: checkUserID.message})
    }

})

app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.delete('/logout', (req, res, next)=>{
    req.logout((err)=>{
        if(err) { return next(err)}
        res.redirect('login')
    })
})
app.post('/:id/like',checkAuthenticated,  async(req, res)=>{

    const video = await db.Content.findById(req.params.id)
    if(!video.likes.includes(user._id)){
        try{
            liked = await db.Content.updateOne(video,
                    {$addToSet: {likes: user._id}})
            res.redirect(`/${req.params.id}`)

        }catch(e){
            res.redirect(`/${req.params.id}`)
        }
    }else{
        await db.Content.updateOne(video,
                {$pull: {likes: user._id}})
        res.redirect(`/${req.params.id}`)
    }
    
})

app.post('/searchVideo', checkAuthenticated, async(req, res)=>{
    const video = await db.Content.findOne({name: req.body.searchVideo})
    if(video)
        res.redirect(`/${video._id}`)
    else{
        res.redirect('/')
    }
})


app.post('/:id/comment', checkAuthenticated, async(req, res)=>{
    try{
        const video = await db.Content.findOneAndUpdate({_id: req.params.id}, 
                {$push: {comment: [user.UserID, req.body.comment]}})
        res.redirect(`/${req.params.id}`)
    }catch{
        console.log('error')
        res.redirect('/')
    }
})
app.get('/:id', checkAuthenticated, async(req, res)=>{

   try{
    
    const video= await db.Content.findById(req.params.id).
    populate('name').exec()
    res.render('show.ejs', {video: video})
    await db.Content.findOneAndUpdate(video, {$inc: {views : 1}})

   }
   catch{
    res.redirect('/')
   } 
})
app.post('/:id/delete', async(req, res)=>{
    console.log(req.params)
    await db.Content.deleteOne({_id: req.params.id})
    res.redirect('/')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

function createLink(link){
    const youtubeIdRegex =
        /^(?:(?:https|http):\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be).*(?<=\/|v\/|u\/|embed\/|shorts\/|watch\?v=)(?<!\/user\/)(?<id>[\w\-]{11})(?=\?|&|$)/;

    return link.match(youtubeIdRegex)?.groups?.id || false;
}


app.listen(`${port}`)
console.log(`Listening on port:${port}`)
