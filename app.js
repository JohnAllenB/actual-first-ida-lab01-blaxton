const express = require('express');
const path = require('path');
const app = express();


app.use(express.static(('./')));


app.listen(3000, () => {
  
});