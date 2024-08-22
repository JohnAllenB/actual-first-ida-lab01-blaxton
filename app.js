const express = require('express')
const app = express()

console.log("I'm on a node server");


app.get('/', function (req, res) {
  res.send('Hello node from Ex on this here local dev box')
})

app.listen(3000)