
var page = require('webpage').create();

var content='';


page.open('http://localhost/app/app.html', function (status) {
     content = page.content;
    console.log('Content: ' + content);
    phantom.exit();
  });
  //console.log(content);
 
//exports.content=content;
