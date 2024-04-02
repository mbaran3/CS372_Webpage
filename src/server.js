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
    res.render('index.ejs')
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

app.post('/editUser', checkAuthenticated, isAdmin, async (req, res)=>{
    await db.Users.findOneAndUpdate({UserID: req.body.UserID}, {role: req.body.Role})
    console.log(req.body.Role)
})


app.post('/register', checkNotAuthenticated, async(req, res)=>{
    
    checkPass = validateRegistatoin.checkPassword(req.body.Password)
    checkUserID = validateRegistatoin.checkUserID(req.body.UserID)
    if(checkPass.isValid && checkUserID.isValid){
        try{

            const hashedPassword = await bcrypt.hash(req.body.Password, 10)
            const data = {
                UserID: req.body.UserID,
                Password: hashedPassword
            }
            await db.Users.insertMany([data])
            res.redirect('/login')
            console.log("added User")
        }
        catch{
    
            res.render('register.ejs', {message: "UserID was already taken."})
            console.log("failed to add user")
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
app.delete('/deleteUser', (req, res, next)=>{
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    return next()
}

function isAdmin(req, res, next){
    if(user.role == "Admin"){
        return next()
    }
    res.redirect('/')
}

function isCotentEditor(req, res, next){
    if(user.role == "Content Editor"){
        return next()
    }
    res.redirect('/')
}


app.listen(`${port}`)
console.log(`Listening on port:${port}`)