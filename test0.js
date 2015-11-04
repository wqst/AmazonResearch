
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
  //fs.write(path, content, 'a');
  //fs.write(path, '\n', 'a');
}
/*
var tmp = '{"name" : "footer", "locations" : [{"anchor" : "page","bottom" : {"measurement" : "absolute","value" : 0}}],"shapes" : [{"anchor" : null,"height" : {"measurement" : "absolute","value" : 1269}},{"anchor" : "viewport","width" : {"measurement" : "relative","value" : 100}}],"content" : [],"colors" : []}';
var data = JSON.parse(tmp);
console.log('The value of name is ' + data.name);
console.log('The value of locations-anchor is ' + data.locations[0].anchor);
console.log('The value of shapes-height-measurement is ' + data.shapes[0].height.measurement);
console.log('The value of shapes-height-value is ' + data.shapes[0].height.value);
console.log('The value of shapes-width-anchor is ' + data.shapes[1].anchor);
console.log('The value of shape-height-anchor is ' + data.shapes[0].anchor);
console.log('The value of shapes-width-measurement is ' + data.shapes[1].width.measurement);
console.log('The value of colors is ' + data.colors);
phantom.exit();
*/
//var amazonJson = '[{"colors":[],"content":[],"locations":[{"anchor":"page","bottom":"","left":{"conditions":[],"measurement":"absolute","value":0},"right":"","top":{"conditions":[],"measurement":"absolute","value":0}}],"selector":"header","shapes":[]},{"colors":[],"content":[],"locations":[{"anchor":"page","bottom":"","left":{"conditions":[],"measurement":"absolute","value":10},"right":"","top":{"conditions":[],"measurement":"absolute","value":3143}}],"selector":"#navFooter","shapes":[]}]'

//var path = 'output.txt';
//var content = 'Hello World!';
//fs.write(path, content, 'w');
//var amazonJson = fs.read('input.txt');
clearfile();
var amazonJson = readfile();
var amazonData = JSON.parse(amazonJson);
console.log(amazonData[0].selector)
console.log(amazonData[1].selector)
//console.log(findProp(amazonData, 'selector'));

var page = require('webpage').create();
console.log('The default user agent is ' + page.settings.userAgent);
page.settings.userAgent = 'SpecialAgent';
page.open('http://www.amazon.com/s?url=search-alias=aps&field-keywords=watches', function(status) {
  if (status !== 'success') {
    console.log('Unable to access network');
  } else {
  	for (var i = 0; i < amazonData.length; i++){
  	var str = "'" + amazonData[i].selector + "'";
  	console.log(str);
    var ua = page.evaluate(function(s) {
      //return document.getElementById('myagent').textContent;
      	//console.log(str);
      	//return document.getElementsByTagName('header');
    	return document.querySelector(str).textContent;
    }, str);
    writefile(ua);
    console.log(ua);
    //console.log(document.querySelector(amazonData[i]).textContent);
    //console.log(amazonData[i].selector);
}
  }
  phantom.exit();
});
/*
$.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D'http%3A%2F%2Fsemantic-link.com%2Frelated.php%3Fword%3Dword'&format=json&diagnostics=true&callback=",function(data){
alert(data.query.results.json.json[0].v);
});
*/

