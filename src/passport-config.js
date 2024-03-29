const localStrategy = require('passport-local')
const bcrypt = require('bcrypt')

function initialize (passport, getUserID, findByID){

    const authUser = async (UserID, password, done) =>{
        user = await getUserID(UserID)

        if(user == null){
            return done(null, false, {message: "No user with that UserID"})
        }
        try{
            if(await bcrypt.compare(String(password),String(user.Password))){
                return done(null, user)
            }else{
                return done(null, false, {message: 'Password is incorrect'})
            }
        }catch(e){
            return done(e)
        }


    }

    passport.use(new localStrategy({usernameField: 'UserID', passwordField: 'Password'} , authUser))
    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser((user, done) =>{
        done(null, user)
    })
}



module.exports = initialize
