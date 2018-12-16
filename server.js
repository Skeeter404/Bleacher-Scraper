var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function(req, res){

    res.render("landing");
});

//scraping articles from bleacher report
app.get("/scrape", function (req, res) {

    axios.get("https://bleacherreport.com/").then(function (response) {

        var $ = cheerio.load(response.data);

        $(".articleContent").each(function (i, element) {

            var result = {};

            result.title = $(this)
                .find("h3")
                .text();
            result.link = $(this)
                .find("a")
                .attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {

                    console.log(dbArticle);
                })
                .catch(function (err) {

                    console.log(err);
                });
        });
        res.render("scrape");
    });
});

app.get("/clear", function(req, res){

    db.Article.remove({})
    .then(function(){
        res.render("clear")
    });
});

app.get("/articles", function(req, res){

    db.Article.find({})
    .populate("comment")
    .then(function(dbArticle){

        let hbsObject = {
            article: dbArticle
        };

        res.render("articles", hbsObject);
    })
    .catch(function(err){

        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    // save the new note that gets posted to the Notes collection
    db.Comment.create(req.body)
    // then find an article from the req.params.id
    .then(function(dbComment){
   // and update it's "note" property with the _id of the new note
      return db.Article.findOneAndUpdate({ _id: (req.params.id) }, { $push: {comment: dbComment.id} }, { new: true });
    })
    .then(function(dbArticle){
  
      res.json(dbArticle);
    })
    .catch(function(err){
  
      res.json(err);
    });
  });

  app.delete("/comments/:id", function(req, res) {

    db.Comment.findOneAndRemove({ _id: req.params.id })
    
    .then(function(dbComment){
   
      res.json(dbComment);
    })
    .catch(function(err){
  
      res.json(err);
    });
  });

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });