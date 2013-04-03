// Simple phantomjs-based html2pdf renderserver for heroku.
// MIT License.
// Copyright Norman Rzepka 2013
//
// Based on html2pdf.js by Thomas Bley
// http://we-love-php.blogspot.de/2012/12/create-pdf-invoices-with-html5-and-phantomjs.html
//
// Requires phantom buildpack
// heroku create --stack cedar --buildpack http://github.com/stomita/heroku-buildpack-phantomjs.git

var server = require("webserver").create();
var system = require("system");
var fs = require("fs");

server.listen(system.env.PORT || 3003, function(request, response) {
  
  if (request.method == "GET") {
    console.log()
    var obj = { url : request.url.split("?")[1] };
  } else {
    var obj = { html : request.post };
  }
  
  renderPdfToTemp(obj, function (err, tempFilename) {

    if (err) {
      console.log("Error: " + err);
      response.statusCode = 500;
      response.close();
    } else {
      console.log("Sending pdf: " + tempFilename);
      response.statusCode = 200;
      response.setEncoding("binary");
      response.setHeader("Content-Type", "application/pdf");
      response.write(fs.read(tempFilename, 'b'));
      response.close();
      fs.remove(tempFilename);
    }
    
  });
});

console.log("Listening on port " + (system.env.PORT || 3003) + ".");

function renderPdfToTemp(obj, callback) {

  var page = require("webpage").create();
  var tempFilename = "/tmp/" + guid() + ".pdf";

  page.paperSize = {
    format: "A4",
    orientation: "portrait",
    margin: { left:"1cm", right:"1cm", top:"1cm", bottom:"1cm" }
  };

  // Zoom factor needs more research
  page.zoomFactor = .944;

  page.onLoadFinished = function () {
    page.render(tempFilename);
    callback(null, tempFilename);
    page.onError = undefined;
    page.onLoadFinished = undefined;
  }
  page.onError = function (msg) {
    callback(msg);
    page.onError = undefined;
    page.onLoadFinished = undefined;
  }

  if (obj.html) {
    page.content = obj.html;
  } else {
    page.open(obj.url);
  }
}


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}