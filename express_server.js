'use strict';

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
require('dotenv').config();

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.urlencoded());

//overrride with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

function getLongURL(shortURL, cb) {

  MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log("Could not connect! Unexpected error. Details below");
      throw err;
    }

    console.log("Connected to the databse!");

    let urls = db.collection("urls");

    urls.findOne({shortURL: shortURL}, (err, result)=>{
      return cb(null, result);

    })

      db.close();

  });

}

function getURLS(cb) {

  MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log("Could not connect! Unexpected error. Details below");
      throw err;
    }

    let urls = db.collection("urls");

    urls.find().toArray((err, result)=>{

      return cb(null, result);

    });

      db.close();

  });

}

function postURL(randomString, newURL) {

  MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log("Could not connect! Unexpected error. Details below");
      throw err;
    }

    let urls = db.collection("urls");

    urls.insert(

      {shortURL: randomString,
        longURL: newURL}

      ,(err, result)=>{
      console.log(`${newURL} was added to database with shortURL: ${randomString}.`);

    });

      db.close();

  });

}

function deleteURL(shortURL) {

  MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log("Could not connect! Unexpected error. Details below");
      throw err;
    }


    let urls = db.collection("urls");

    urls.deleteOne({"shortURL": shortURL});

    db.close();

  });

}

function updateURL(shortURL, longURL) {

  MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log("Could not connect! Unexpected error. Details below");
      throw err;
    }

    let urls = db.collection("urls");

    urls.update({"shortURL": shortURL}, {$set: {"longURL": longURL}});

    db.close();

  });

}

//shows a list of LONG URLS on INDEX PAGE
app.get('/urls', (req, res) => {
  getURLS((err, URLlist) => {
    res.render('urls_index', {
      URLlist: URLlist
    });
  });

});

// gets URLS/new page
app.get('/urls/new', (req, res) => {
  res.render('urls_new', {});
});

//shows the page to update short URL
app.get('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  getLongURL(shortURL, (err, longURL) => {
    res.render('urls_show', {
      shortURL: shortURL
    });
  });
});


//redirects user to longURLm
app.get('/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  getLongURL(shortURL, (err, result) => {
  // console.log(result.longURL);
  // let longURL = urlDatabase[];
  res.redirect(result.longURL);
  });
});

// takes in URL that user puts in form page
app.post('/urls', (req, res) => {
  // console.log(req.body);  // debug statement to see POST parameters
  var randomString = generateRandomString();
  var newURL = req.body.longURL;
  postURL(randomString, newURL);
  res.redirect("/urls");         // Respond with URLS_index page
});

//deletes a shortened URL from database
app.delete('/urls/:id', (req, res) => {
  var shortURL = req.params.id;
  deleteURL(shortURL);
  res.redirect("/urls");
});


//edits an existing shortened URL
app.put('/urls/:id', (req, res) => {
  var shortURL = req.params.id;
  var longURL = req.body.longURL;
  updateURL(shortURL, longURL);
  res.redirect("/urls");

});

//server listening
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



//generates random string
function generateRandomString() {
  var randomString = '';

  var charset = 'abcdefghijklmnopqrstuvwxyz123456789';


  for (var i = 0; i < 6; i++) {
  var randomPosition = Math.floor(Math.random() * 36);

  randomString += charset[randomPosition];
  }

  return randomString;
}












