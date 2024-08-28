const express = require('express');
const path = require('path'); // Make sure to require 'path'
const app = express();

console.log("I'm on a node server");

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
