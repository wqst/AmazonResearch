var casper = require('casper').create({
  verbose: true,
  logLevel: 'debug',
  clientScripts: ['jquery-2.1.4.js'],
  viewportSize: {
    width: 1920,
    height: 1080
  }
});

casper.start('http://www.amazon.com/s?url=search-alias=aps&field-keywords=watches', function(){
  this.echo(this.getTitle());
});

function findProp(obj, prop, defval){
    if (typeof defval == 'undefined') defval = null;
    prop = prop.split('.');
    for (var i = 0; i < prop.length; i++) {
        if(typeof obj[prop[i]] == 'undefined')
            return defval;
        obj = obj[prop[i]];
    }
    return obj;
}

function readfile(){
  var fs = require('fs');
  var result = fs.read('input.txt');
  return result;
}

function clearfile(){
  var fs = require('fs');
  var path = 'output.txt';
  fs.write(path, '', 'w');
}

function writefile(ua){
  var fs = require('fs');
  var path = 'output.txt';
  var content = 'Hello World';
  fs.write(path, ua, 'a');
  fs.write(path, '\n', 'a');
  fs.write(path, '----------------------------------------------------------', 'a');
}

function evaluateContent(url, tmp){
  var page = require('webpage').create();
  console.log('The default user agent is ' + page.settings.userAgent);
  page.settings.userAgent = 'SpecialAgent';
  page.open("http://www.amazon.com/s?url=search-alias=aps&field-keywords=watches", function(status) {
    if (status !== 'success') {
      console.log('Unable to access network');
    } else {
      var ua = page.evaluate(function(tmp) {
        return document.querySelector(tmp).textContent;
      }, tmp);
      writefile(ua);
      console.log(ua);
  }
  //phantom.exit();
});
}

function decodePageLocations(elements, Location, Measurement) {
  //document.elementFromPoint(x, y); 
  //TODO: get back the pagelocation value
}

function decodeViewportLocations(elements, input, Location, Measurement) {
  //document.elementFromPoint(x, y);
  //TODO: get back the viewPort location value
}

function programExit(){
  phantom.exit();  
}

clearfile();
var amazonJson = readfile();
var amazonData = JSON.parse(amazonJson);
var selectors = [];
console.log(amazonData[0].selector)
console.log(amazonData[1].selector)

for (var i = 0; i < amazonData.length; i++){
  selectors.push(amazonData[i].selector);
  evaluateContent("http://www.amazon.com/s?url=search-alias=aps&field-keywords=watches",amazonData[i].selector);
}

casper.then(function highlightTargets() {
  casper.evaluate(function(selectors) {
    selectors.forEach(function(selector) {
      $(selector).css('border', '8px solid blue');
    });

    $(input.search.bar).css('border', '8px solid yellow');
  }, selectors);
});

//Take Screenshots so we can see what Casper Saw
casper.then(function() {
  this.capture('screenshot.png');
});

casper.then(function() {
    casper.wait(4000, function() {
        this.echo('should appear after 4s');
    });
});

casper.run();
//programExit();
//evaluateContent(amazonData[1].selector);

