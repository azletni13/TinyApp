'use strict'

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded());

//overrride with POST having ?_method=DELETE
app.use(methodOverride('_method'));


app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//gets URLS page and shows all urls in urlDatabase
app.get('/urls', (req, res) => {
  res.render('urls_index', {
    urls: urlDatabase
  });
});

// gets URLS/new page
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});


//gets URLS/id page and shows the website associated with that id
app.get('/urls/:id', (req, res) => {
  res.render('urls_show', {
    shortURL: req.params.id
  });
});

//redirects user to longURL
app.get('/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// takes in URL that user puts in form page
app.post('/urls', (req, res) => {
  // console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

//deletes a shortened URL from database
app.delete('/urls/:id', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//edits an existing shortened URL
app.put('/urls/:id', (req, res) => {
  var shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");

});


//server listening
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



//generates random string
function generateRandomString() {
  const randomString = '';

  const charset = 'abcdefghijklmnopqrstuvwxyz123456789'

  for (var i = 0; i > 6; i++) {
    let randomposition = Math.floor(Math.random() * 37);
    randomString += charset[randomposition];
  }
  console.log(randomString);

}












