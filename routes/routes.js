// dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = (app)=>{
    // main page
    app.get('/', (req, res)=>{
        res.render('index');
    });

    // saved articles page
    app.get('/saved', (req, res)=>{
        res.render('saved')
    });

    // scrape data from one site and place it into the mongodb db
    app.get('/scrape', (req, res)=>{
        // get body of url
        axios.get('http://www.echojs.com/').then((response)=>{
            // Use cheerio for shorthand selector $
            var $ = cheerio.load(response.data);

            // loop through articles
            $('article h2').each(function(i, element) {
                var result = {};

                result.title = $(this).children('a').text();
                result.link = $(this).children('a').attr('href');

                // create new Article
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

    // show articles after scraping
    app.get('/articles', (req, res)=>{
        db.Article.find({})
        .then((dbArticle)=>{
            var articleObj = {article: dbArticle};

            // render page with articles found
            res.render('index', articleObj);
        })
        .catch((err)=>{
            res.json(err);
        });
    });
};