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

function writefile(text, tmp){ //pass two elements and write into the file based on the elements
  var fs = require('fs');
  var path = 'output.txt';
  var content = 'The below elements showed is ' + tmp;

  fs.write(path, content, 'a');
  fs.write(path, '\n', 'a');
  fs.write(path, text, 'a');
  fs.write(path, '\n', 'a');
  fs.write(path, '----------------------------------------------------------', 'a');
  fs.write(path, '\n', 'a');
}

function parseObj(obj){
  //console.log(obj.locations[0].top.value);
  var str = "";
  if (obj.locations.length == 2){
    console.log("This is navFooter!");
    str = "navFooter";
  }  
  else {
    console.log("This is header!");
    str = "header";
  }
  return str;
}

function judge(obj, tmp){
  //console.log("in the function");
  if (obj == null) { //NULL object, impossible to be the things we have
    console.log("The object is NULL");
    return false;
  }
  //console.log("what is");
  console.log("The offsetTop is ", obj.offsetTop);
  console.log("The offsetLeft is", obj.offsetLeft);
  if (tmp === 'navFooter' && obj.offsetTop > 3000 && obj.offsetLeft >= 10) //judge whether it is navFooter
    return true;
  if (tmp === 'header' && obj.offsetTop === 0 && obj.offsetLeft === 0) //judge whether it is header
    return true;
  return false;
}

function isheader(obj){
  if (obj == null){
    console.log("The object is NULL");
    return false;
  }
  console.log("The offsetTop is", obj.offsetTop);
  console.log("The offsetLeft is", obj.offsetLeft);
}

function evaluateContent(url, tmp){
  var page = require('webpage').create();
  console.log('The default user agent is ' + page.settings.userAgent);
  page.settings.userAgent = 'SpecialAgent';
  page.open(url, function(status) {
    if (status !== 'success') {
      console.log('Unable to access network');
    } else {
      var elementList = page.evaluate(function(tmp) {
        if (tmp === 'navFooter')
        return document.querySelectorAll("div[id*='Footer']");//.textContent;
        else return document.querySelectorAll("header");
      }, tmp); //"div[id^='nav']", "#navFooter" ^begin *contains $ends with
      console.log(elementList.length);
      
      for (var i = 0; i < elementList.length; i++) {
        var isvalid = judge(elementList[i], tmp);
        console.log(i+1);
        if (isvalid) {
          console.log(elementList[i].textContent);
          writefile(elementList[i].textContent, tmp);
        }
      }
      //console.log(elementList);
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
//console.log(amazonData.length)

for (var i = 0; i < amazonData.length; i++){
  //selectors.push(amazonData[i].selector);
  var objType = parseObj(amazonData[i]);
  evaluateContent("http://www.amazon.com/s?url=search-alias=aps&field-keywords=watches", objType);
}

/*
casper.then(function highlightTargets() {
  casper.evaluate(function(selectors) {
    selectors.forEach(function(selector) {
      $(selector).css('border', '8px solid blue');
    });

    $(input.search.bar).css('border', '8px solid yellow');
  }, selectors);
});
*/

//Take Screenshots so we can see what Casper Saw
casper.then(function() {
  this.capture('screenshot.png');
});

casper.then(function() {
    casper.wait(100000, function() {
        this.echo('should appear after 4s');
    });
});

casper.run();
//programExit();
//evaluateContent(amazonData[1].selector);

