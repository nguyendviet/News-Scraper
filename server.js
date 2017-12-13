// dependencies
const express = require('express');
const bParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const eHandle = require('express-handlebars');

var PORT = process.env.PORT || 3000;

// initialize express
const app = express();

// use morgan logger for logging requests
app.use(logger('dev'));
// use body-parser for handling form submissions
app.use(bParser.urlencoded({extended: true}));
// set static directory
app.use(express.static('public'));
// Set Handlebars as the default templating engine
app.engine('handlebars', eHandle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// database configuration
mongoose.Promise = Promise;
mongoose.connect(
    'mongodb://localhost/news_scraper', 
    {userMongoClient: true}
);

require('./routes/routes.js')(app);

// start server
app.listen(PORT, ()=>{
    console.log('App running on port ' + PORT);
});
