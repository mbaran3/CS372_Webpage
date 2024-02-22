//todo literally everything
const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 
error = {message:[""],message2:[""],message3:[""]}
const users = require("./info.json");

app.post('/login', (req, res) =>{
	error.message=""
	app.post('/signup', (req, res) =>{
		res.render('pages/signup',error)
	})
	if(users[req.body.userName]!=undefined) {
		if( users[req.body.userName].strikes>=4) {
		error.message=("Your Account is Locked")
		  res.render('pages/login',error)
		} else {
			if(users[req.body.userName].passWord==req.body.passWord) {
			  res.sendFile(__dirname + '/thePage.html')
			users[req.body.userName].strikes=0;
			} else {
			users[req.body.userName].strikes++;
			error.message=("Error: Invalid Password, "+(5-users[req.body.userName].strikes)+" Attempts Remaining")
			  res.render('pages/login',error)
			}
		}
	} else {
		error.message="Error: Username Not Found"
		res.render('pages/login',error)
	}
	fs.writeFile("./info.json",JSON.stringify(users),err => {if (err) throw err;});
})

app.post('/signup', (req, res) =>{
		error.message=""
		error.message2=""
		error.message3=""
		user = req.body.userName
		pass = req.body.passWord
		if(user.length>=4) {
			var bool = false;
			for(let i=0; i<user.length;i++) {
				if (user.charAt(i)!="_"&&(user.charAt(i)<"a"||user.charAt(i)>"z"))
					bool = true
			}
			if (bool)
				error.message="Error: Username Can Only Contain Lower Case and Underscores"
		} else
			error.message="Error: Username Must be 4 or More Characters"

		if(pass.length>=9) {
			var dot = false;
			var special= false;
			var cap= false;
			var low= false;
			var num= false;
			for(let i=0; i<pass.length;i++) {
				if ((pass.charAt(i)>="!"&&pass.charAt(i)<="/")||(pass.charAt(i)>=":"&&pass.charAt(i)<="@")||(pass.charAt(i)>="["&&pass.charAt(i)<="'")||(pass.charAt(i)>="{"&&pass.charAt(i)<="~"))
					special = true;
				if (pass.charAt(i)!=".")
					dot = true;
				if (pass.charAt(i)>="a" && pass.charAt(i)<="z")
					low = true;
				if (pass.charAt(i)>="A" && pass.charAt(i)<="Z")
					cap = true;
				if (pass.charAt(i)>="0" && pass.charAt(i)<="9")
					num = true;
			}
			if(!(special&&dot&&low&&cap&&num))
				error.message2=("Error: Password Does Not Meet Requirements ");
		} else
			error.message2="Error: Password Must be 9 or More characters"
		if(pass!=req.body.pass2Word)
			error.message3="Error: Passwords do Not Match"
		if(error.message==""&&error.message2==""&&error.message3==""&&user!=""&&pass!="") {
			if(users[user]==undefined) {
				obj={passWord:pass,strikes:0}
				users[user]=(obj);
				fs.writeFile("./info.json",JSON.stringify(users),err => {if (err) throw err;});
				error.message=""
				console.log("Account Created!")
				res.render('pages/login',error)
			} else
			error.message="Error: Username Taken"
		} else
		res.render('pages/signup',error)

})

app.get('/', (req, res) =>{
		error.message=""
		error.message2=""
		error.message3=""
  res.render('pages/login',error)
});
app.get('/login.html', (req, res) =>{
		error.message=""
		error.message2=""
		error.message3=""
  res.render('pages/login',error)
});
app.get('/signup.html', (req, res) =>{
		error.message=""
		error.message2=""
		error.message3=""
	  res.render('pages/signup',error)
})
app.get('/thePage.html', (req, res) =>{
  res.sendFile(__dirname + '/thePage.html')
})
app.get('/favicon.png', (req, res) =>{
  res.sendFile(__dirname + '/assets/favicon.png')
})
app.get('/info.json', (req, res) =>{
  res.sendFile(__dirname + '/info.json')
})

app.listen(port, () =>{
  console.log(`Server running on port : ${port}`)
})



