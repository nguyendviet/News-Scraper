// Dependencies
const express = require('express');
const mongojs = require('mongojs');
const request = require('request');
const cheerio = require('cheerio');
const eHandle = require('express-handlebars');

// Initialize Express
const app = express();

// Set static directory
app.use(express.static('public'));

// Set Handlebars as the default templating engine
app.engine('handlebars', eHandle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Database configuration
const databaseUrl = 'news_scraper';
const collections = ['scrapedData'];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', (err)=>{
    console.log('Database Error:', err);
});

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
  // Make a request for the news section of ycombinator
  request('https://news.ycombinator.com/', (error, response, html)=>{
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    
        // For each element with a "title" class
        $(".title").each((i, element)=>{
            // Save the text and href of each link enclosed in the current element
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");

            // If this found element had both a title and a link
            if (title && link) {
                // Insert the data in the scrapedData db
                db.scrapedData.insert({
                    title: title,
                    link: link
                },
                (err, inserted)=>{
                if (err) {
                    // Log the error if one is encountered during the query
                    console.log(err);
                }
                else {
                    // Otherwise, log the inserted data
                    console.log(inserted);
                }
                });
            }
        });
    });

    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, (err, found)=>{
        // Throw any errors to the console
        if (err) {
            console.log(err);
        }
        // If there are no errors, send the data to the browser as json
        else {
            var obj = {data: found};
            res.render('index', obj);
        }
    });
});


// Listen on port 3000
app.listen(3000, ()=>{
    console.log('App running on port 3000!');
});
