var http = require('http')
var bankai = require('bankai')
var api = require('./api')

var apiHandler = api.start()
var assets = bankai('./src')
var server = http.createServer(handler)
server.listen(process.env.PORT || 8080)

function handler (req, res) {
  var url = req.url
  if (/^\/api\/v/.test(url)) {
    apiHandler(req, res)
  } else if (url === '/bundle.js') {
    assets.js(req, res).pipe(res)
  } else if (url === '/bundle.css') {
    assets.css(req, res).pipe(res)
  } else if (url === '/') {
    assets.html(req, res).pipe(res)
  } else if (req.headers['accept'].indexOf('html') > 0) {
    assets.html(req, res).pipe(res)
  } else {
    assets.static(req).pipe(res)
  }
}
