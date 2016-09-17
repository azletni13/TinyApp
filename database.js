function getLongURL(shortURL) {

 MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log("Could not` connect! Unexpected error. Details below");
      throw err;
    }

    console.log("Connected to the databse!");

    let urls = db.collection("urls");

    urls.findOne({shortURL}, (err, result)=>{
      console.log(result)

    })




      db.close();

  });

}

module.exports = {getLongURL};