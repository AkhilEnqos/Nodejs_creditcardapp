var express = require('express');
var path = require('path');
var app = express();
var mysql = require('mysql');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));


//mysql dbconnection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true,
    database: "mydb"
  });

   //Retrieve Cards Details from DB
   con.connect(function(err) {
    if (err) throw err;
    //Select all creditcards and return the result object:
    var sql = "SELECT * FROM creditcard;SELECT * FROM card_category;SELECT * FROM card_bank;SELECT * FROM card_rating;";
    con.query(sql, function(error, result, fields) {
      if (error) {
          throw error;
      }
      console.log('successfully retrieve');
      
      // app.get('/creditcard', function(req, res){
      //   res.render('creditcard', {data: result[0],datacategory: result[1],databank: result[2],datarating: result[3]});
      // });
       app.get('/',function(req,res){
        res.send(result);
       });
       
  });
  });
  


app.listen(3002);


