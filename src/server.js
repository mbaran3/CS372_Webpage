//todo literally everything

const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = 8080;


app.get('/', (req, res) =>{
  res.sendFile(__dirname + '/login.html')
});
app.get('/signup.html', (req, res) =>{
  res.sendFile(__dirname + '/signup.html')
})

app.listen(port, () =>{
  console.log(`Server running on port : ${port}`)
})


app.post('/thePage.html', (req, res) =>{
  res.sendFile(__dirname + '/thePage.html')
})


