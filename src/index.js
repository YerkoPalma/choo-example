var css = require('sheetify')
var choo = require('choo')
var http = require('http')
var cookie = require('cookie-cutter')
var homeView = require('./views/home')
var postView = require('./views/post')
var newPostView = require('./views/new-post')

css('tachyons')

// initialize choo
var app = choo()

app.use(function (state, emitter) {
  state.router = window.RouterInstance
  state.posts = []
  emitter.on('addPost', function (post) {
    makeRequest('POST', '/api/v1/post', post, function (body, res) {
      state.posts.push(body.data)
      emitter.emit(state.events.PUSHSTATE, '/')
    })
  })
})

app.route('/', homeView)
app.route('/new', newPostView)
app.route('/:post', postView)

// start app
var tree = app.start()
document.body.appendChild(tree)

function makeRequest (method, route, data, cb) {
  var headers = {'Content-Type': 'application/json'}
  if (cookie.get('token')) headers = Object.assign(headers, {'x-session-token': cookie.get('token')})
  var req = http.request({ method: method, path: route, headers: headers }, function (res) {
    if (res.headers && res.headers['x-session-token']) {
      if (res.headers['timeout']) {
        cookie.set('token', res.headers['x-session-token'], { expires: res.headers['timeout'] })
      } else {
        cookie.set('token', res.headers['x-session-token'])
      }
    }
    res.on('error', function (err) {
      // t.error(err)
      throw err
    })
    var body = []
    res.on('data', function (chunk) {
      body.push(chunk)
    })
    res.on('end', function () { cb(JSON.parse(body.toString()), res) })
  })
  req.on('error', function (err) {
    // t.error(err)
    throw err
  })
  if (data) {
    req.write(JSON.stringify(data))
  }
  req.end()
}
