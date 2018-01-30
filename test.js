// 
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var cheerio = require('cheerio');
var binPath = phantomjs.path;
 
var childArgs = [
  path.join(__dirname, 'script.js'),
  'some other argument (passed to phantomjs script)'
];
 
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  console.log(stdout);
  var $ = cheerio.load(stdout);
   
  var numItems = $('div.productcontainer').length;

  console.log(numItems);
});