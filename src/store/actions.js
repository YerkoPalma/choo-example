var http = require('http')
var cookie = require('cookie-cutter')

function getAllPosts (store) {
  var posts = []
  // GET /post
  makeRequest('GET', '/api/v1/post', null, function (body, res) {
    // if ok
    posts = body.data
    store.dispatch({ type: 'SET_POSTS', data: posts })
  })
}
function addPost (store, post, cb) {
  // POST /post
  makeRequest('POST', '/api/v1/post', post, function (body, res) {
    // if ok
    store.dispatch({ type: 'ADD_POST', data: body.data })
    cb()
  })
}

module.exports = {
  getAllPosts: getAllPosts,
  addPost: addPost
}

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
