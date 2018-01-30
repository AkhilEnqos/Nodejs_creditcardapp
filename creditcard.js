var express = require('express');
var path = require('path');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
//var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require("body-parser");

var cardDescText=[];
var cardCategory=[],card_bank=[],card_rating=[];
//mysql dbconnection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true,
    database: "mydb"
  });


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// app.get('/', function (req, res) {
//     res.sendFile('http://localhost/enqosweb/creditcard/');
// });

var childArgs = [
  path.join(__dirname, 'script.js'),
  'some other argument (passed to phantomjs script)'
];
 
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  //console.log(stdout);
  var $ = cheerio.load(stdout);
   
  var numItems = $('div.productcontainer').length;
    
  //  console.log(numItems);
    for(var i=1;i<=numItems;i++){
        var cardDetails = [];       
        cardDetails.push($('#productheading'+i).text());
        cardDetails.push($('#productdescription'+i+ ' ul li'));
        cardDetails.push($('#creditcardimage'+i+ ' img').attr('src'));
        cardDetails.push($('#creditcardimage'+i+ ' a').attr('href'));
        let cardcredit = $('#creditcardimage'+i+ ' .creditneededcontainer');
        let s1 = cardcredit.toString().split('</div>');
        let s2 = s1[1].toString().split('<br>');
        cardDetails.push(s2[0]);
        cardDetails.push(s2[1]);
        var classArray = [];
$('#product'+i).parent().each(function(){
    classArray.push($(this).attr('class')); // To save the class names
});

      //  let s3 = $('#product'+i).parent().attr('class');
      let s3=classArray;
        cardDetails.push(s3);
        
         cardDescText.push(cardDetails);
    }
    
     $('#getcategoryoffers option').each(function(){
         var cardcat = [];
        cardcat.push($(this).html());
        cardcat.push($(this).val());
        cardCategory.push(cardcat);
    });
    $('#getbankoffers option').each(function(){
      var cardbank = [];
     cardbank.push($(this).html());
     cardbank.push($(this).val());
     card_bank.push(cardbank);
 });
 $('#getcreditratingoffers option').each(function(){
      var cardrating = [];
     cardrating.push($(this).html());
     cardrating.push($(this).val());
     card_rating.push(cardrating);
 });


 con.connect(function(err) {
  if (err) throw err;
  
      var sql = "REPLACE INTO creditcard (card_name, card_desc, card_img, card_link, credit_need1, credit_need2, card_class) VALUES ?";
        con.query(sql, [cardDescText], function (err, result) {
          if (err){
            throw err;
          } 
          else{
            var sql2 = "REPLACE INTO card_category (browse_category,category_value) VALUES ?";
            con.query(sql2, [cardCategory], function (err, result) {
              if (err) {throw err;}
              else{
                var sql3 = "REPLACE INTO card_bank (browse_bank,bank_value) VALUES ?";
                con.query(sql3, [card_bank], function (err, result) {
                  if (err) {throw err;}
                  else{
                    var sql3 = "REPLACE INTO card_rating (browse_rating,rating_value) VALUES ?";
                    con.query(sql3, [card_rating], function (err, result) {
                      if (err) throw err;
                      console.log("1 record inserted");
                    });
                  }
                  console.log("1 record inserted");
                });
              }
              console.log("1 record inserted");
            });
          }
          console.log("1 record inserted");
        });
    
   // console.log("Number of records deleted: " + result.affectedRows);

});
});

// app.post('/mydata', function (req, res) {

//     var $ = cheerio.load(req.body.bodyData);
//     res.end(req.body.bodyData);
// });

var port = 8083;




app.listen(port);
console.log('server running on' + port);