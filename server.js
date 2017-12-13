// Dependencies
const express = require('express');
const bParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const eHandle = require('express-handlebars');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./models');

var PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger('dev'));
// Use body-parser for handling form submissions
app.use(bParser.urlencoded({extended: true}));
// Set static directory
app.use(express.static('public'));
// Set Handlebars as the default templating engine
app.engine('handlebars', eHandle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Database configuration
mongoose.Promise = Promise;
mongoose.connect(
    'mongodb://localhost/news_scraper', 
    {userMongoClient: true}
);

// Main route
app.get('/', (req, res)=>{
    res.render('index');
});

// Retrieve data from the db
app.get('/saved', (req, res)=>{
    res.render('saved')
});

// Scrape data from one site and place it into the mongodb db
app.get('/scrape', (req, res)=>{
    // Send request to get data
    axios.get('http://www.echojs.com/').then((response)=>{
        var $ = cheerio.load(response.data);

        $('article h2').each(function(i, element) {
            var result = {};

            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            // Create new Article
            db.Article.create(result)
            .then((dbArticle)=>{
                console.log('Article added to database:\n' + dbArticle);
            })
            .catch((err)=>{
                console.log(err);
            });
        });

        res.redirect('/articles');
    });
});

app.get('/articles', (req, res)=>{
    db.Article.find({})
    .then((dbArticle)=>{
        var articleObj = {article: dbArticle};

        res.render('index', articleObj);
    })
    .catch((err)=>{
        res.json(err);
    });
});

// Start server
app.listen(PORT, ()=>{
    console.log('App running on port ' + PORT);
});
