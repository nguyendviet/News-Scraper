// dependencies
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

module.exports = (app)=>{
    // main page
    app.get('/', (req, res)=>{
        // look for existing articles in database
        db.Article.find({})
        .then((dbArticle)=>{
            if (dbArticle.length == 0) {
                // if no articles found, render index
                res.render('index');
            }
            else {
                // if there are existing articles, show articles
                res.redirect('/articles');
            }
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // saved articles page
    app.get('/saved', (req, res)=>{
        db.Article.find({saved: true})
        .then((dbArticle)=>{
            let articleObj = {article: dbArticle};

            // render page with articles found
            res.render('saved', articleObj);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // scrape data from one site and place it into the mongodb db
    app.get('/scrape', (req, res)=>{
        // get body of url
        axios.get('http://www.bbc.com/sport/football').then((response)=>{

            // Use cheerio for shorthand selector $
            const $ = cheerio.load(response.data);
            
            $('.lakeside__content').each(function(i, element) {
                let result = {};
                const title = $(this).children('h3').children('a').children('span').text();
                const link = $(this).children('h3').children('a').attr('href');
                const summary = $(this).children('p').text();

                result.title = title;
                result.link = link;
                result.summary = summary;

                // create new Article
                db.Article.create(result)
                .then((dbArticle)=>{
                    console.log(dbArticle);
                    //if error count ++ 
                })
                .catch((err)=>{
                    console.log('\nerror while saving to database: ' + err);
                });
            });
            // res.json(response.data);
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
            let articleObj = {article: dbArticle};

            // render page with articles found
            res.render('index', articleObj);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // save article
    app.put('/article/:id', (req, res)=>{
        let id = req.params.id;

        db.Article.findByIdAndUpdate(id, {$set: {saved: true}})
        .then((dbArticle)=>{
            res.json(dbArticle);
        })
        .catch((err)=>{
            res.json(err);
        });
    });

    // remove article from page 'saved'
    app.put('/article/remove/:id', (req, res)=>{
        let id = req.params.id;

        db.Article.findByIdAndUpdate(id, {$set: {saved: false}})
        .then((dbArticle)=>{
            res.json(dbArticle);
        })
        .catch((err)=>{
            res.json(err);
        });
    });
};