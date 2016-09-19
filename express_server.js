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

var conn;

MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
      console.log("Could not connect! Unexpected error. Details below");
      throw err;
    };
    console.log("Connected to the databse!");
    conn = db;
});


function getLongURL(shortURL, cb) {
    let urls = conn.collection("urls");
    urls.findOne({shortURL: shortURL}, (err, result)=>{
      return cb(null, result);
    });
};

function getURLS(cb) {
    let urls = conn.collection("urls");
    urls.find().toArray((err, result)=>{
      return cb(null, result);
    });
};

function postURL(randomString, newURL) {
    let urls = conn.collection("urls");
    urls.insert(
      {shortURL: randomString,
        longURL: newURL}
      ,(err, result)=>{
      console.log(`${newURL} was added to database with shortURL: ${randomString}.`);
    });
};

function deleteURL(shortURL) {
    let urls = conn.collection("urls");
    urls.deleteOne({"shortURL": shortURL});
};

function updateURL(shortURL, longURL) {
    let urls = conn.collection("urls");
    urls.update({"shortURL": shortURL}, {$set: {"longURL": longURL}});
};

app.get('/', (req, res) => {
  res.redirect('urls/new');
});

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
  var shortURL = req.params.id;
  getLongURL(shortURL, (err, longURL) => {
    res.render('urls_show', {
      shortURL: shortURL
    });
  });
});


//redirects user to longURL
app.get('/u/:shortURL', (req, res) => {
  var shortURL = req.params.shortURL;
  getLongURL(shortURL, (err, result) => {
    if (!err && result) {
      res.redirect(result.longURL);
    } else {
      res.send("This page does not exist");
    }
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
  let shortURL = req.params.id;
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

process.on('exit', () => conn.close());


//generates random string
function generateRandomString() {
  var randomString = '';
  const charset = 'abcdefghijklmnopqrstuvwxyz123456789';
  for (var i = 0; i < 6; i++) {
    var randomPosition = Math.floor(Math.random() * 36);
    randomString += charset[randomPosition];
  };
  return randomString;
};












