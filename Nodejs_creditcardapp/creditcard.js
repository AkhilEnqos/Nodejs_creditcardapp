var express = require('express');
var path = require('path');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var cardDescText=[];
var cardCategory=[],card_bank=[];
//mysql dbconnection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
  });


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app.html');
});

app.post('/mydata', function (req, res) {
    var $ = cheerio.load(req.body.bodyData);

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


   
    
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO creditcard (card_name, card_desc, card_img, card_link, credit_need1, credit_need2, card_class) VALUES ?";
        con.query(sql, [cardDescText], function (err, result) {
          if (err){
            throw err;
          } 
          else{
            var sql2 = "INSERT INTO card_category (browse_category,category_value) VALUES ?";
            con.query(sql2, [cardCategory], function (err, result) {
              if (err) {throw err;}
              else{
                var sql3 = "INSERT INTO card_bank (browse_bank,bank_value) VALUES ?";
                con.query(sql3, [card_bank], function (err, result) {
                  if (err) throw err;
                  console.log("1 record inserted");
                });
              }
              console.log("1 record inserted");
            });
          }
          console.log("1 record inserted");
        });
      });
     

      

    res.end(req.body.bodyData);
});

var port = 8081;




app.listen(port);
console.log('server running on' + port);