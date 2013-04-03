// html2pdf.js
var page = require("webpage").create();
var server = require("webserver").create();
var system = require("system");
var fs = require("fs");

server.listen(system.env.PORT || 3003, function(request, response) {
  renderPdfToTemp(request.post, function (err, tempFilename) {
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

function renderPdfToTemp(html, callback) {
  var tempFilename = "/tmp/" + guid() + ".pdf";
  // change the paper size to letter, add some borders
  // add a footer callback showing page numbers
  page.paperSize = {
    format: "A4",
    orientation: "portrait",
    margin: { left:"1cm", right:"1cm", top:"1cm", bottom:"1cm" }
  };
  page.zoomFactor = .944;
  page.content = html;
  page.onLoadFinished = function () {
    page.render(tempFilename);
    callback(null, tempFilename);
  }
  page.onError = function (msg) {
    callback(msg);
  }
}


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}