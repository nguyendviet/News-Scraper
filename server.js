// dependencies
const express = require('express');
const bParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const eHandle = require('express-handlebars');

let PORT = process.env.PORT || 3000;
// let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/news_scraper';

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
// mongoose.connect(MONGODB_URI, {userMongoClient: true});
mongoose.connect('mongodb://heroku_1wp6rsx1:300oce6pqg6l1q0cur0c7sdgcj@ds141786.mlab.com:41786/heroku_1wp6rsx1');
let db = mongoose.connection;

// check connection status
db.on('error', (error)=>{
  console.log(`Connection error ${error}`);
});

db.once('open', ()=>{
  console.log(`Connected!`);
});

require('./routes/routes.js')(app);

// start server
app.listen(PORT, ()=>{
    console.log(`App running on port ${PORT}`);
});