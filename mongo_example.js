"use strict";

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";

console.log(`Connectiong to MongoDB running at: ${MONGODB_URI}`);


// this goes in your routes:
/*
getUrls(function(urls) {
  res.render("asdasdf", {urls: urls});
});


// this goes in a module:
readUrls = function(callback) {




}
*/

readUrls = function(callback) {

 MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log("Could not connect! Unexpected error. Details below");
      throw err;
    }

    console.log("Connected to the databse!");
    let urls = db.collection("urls");

    console.log("Retreiving documents for the 'urls' collection...");
    urls.find().toArray((err, results) => {


      console.log("results: ", results);
      callback(results);

      console.log("Disconnecting from Mongo!");
      db.close();

    });

  });

}




// function geturlDatabase(db, shortURL, cb) {
//   let query = {"shortURL": shortURL};
//   db.collection("urls").findOne(query, (err, result) => {
//     if (err) {
//       return cb(err);
//     }
//     return cb(null, result.longURL);
//   });
// }

// geturlDatabase();