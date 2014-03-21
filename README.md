phantom-renderserver
====================

Simple phantomjs-based html2pdf renderserver for Heroku.

## Setup
Fork and create a heroku project with phantom buildpack
```
heroku create --stack cedar --buildpack http://github.com/stomita/heroku-buildpack-phantomjs.git
```

## How to use
Pass a URL as query string.

```
GET http://phantom-renderserver.herokuapp.com/?http://google.com/
```

Send an HTML document as `POST` body.

```
POST http://phantom-renderserver.herokuapp.com/

<!doctype html>
<html>
  <head>...</head>
  <body>...</body>
</html>
```


This implementation outputs PDFs in A4 portrait format. You might want to change for to your needs.

**Caution**: The web server in phantomjs is not considered robust, so you shouldn't really use this in production.


## Credits
Based on [html2pdf.js](http://we-love-php.blogspot.de/2012/12/create-pdf-invoices-with-html5-and-phantomjs.html
) by Thomas Bley.


## License
[MIT](http://opensource.org/licenses/MIT)
&copy; Norman Rzepka 2014
