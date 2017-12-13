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
        axios.get('http://www.bbc.com/sport/football').then((response)=>{

            // Use cheerio for shorthand selector $
            var $ = cheerio.load(response.data);
            var result = {};

            $('.lakeside__title').each(function(i, element) {
                var title = $(this).children('a').children('span').text();
                var link = $(this).children('a').attr('href');

                result.title = title;
                result.link = link;

                // create new Article
                db.Article.create(result)
                .then((dbArticle)=>{
                    console.log(dbArticle);
                })
                .catch((err)=>{
                    console.log('\nerror while saving to database: ' + err);
                });
            });

            res.redirect('/articles');
        })
        .catch((error)=>{
            console.log('\nerror while getting data from url: ' + error);
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