var express = require('express');
var path = require('path');
var app = express();
var mysql = require('mysql');
app.set('view engine', 'ejs');


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
    var sql = "SELECT * FROM creditcard;SELECT * FROM card_category;SELECT * FROM card_bank;";
    con.query(sql, function(error, result, fields) {
      if (error) {
          throw error;
      }
      app.get('/creditcard', function(req, res){
        res.render('creditcard', {data: result[0],datacategory: result[1],databank: result[2]});
      });
  });
   
  });
  


app.listen(3000);


