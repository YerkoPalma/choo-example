var tape = require('tape')
var http = require('http')
var api = require('../api')
var server

tape('setup', function (t) {
  var handler = api.start()
  server = http.createServer(handler)
  server.listen(8080)
  t.end()
})

tape('/api/v1/post', function (t) {
  t.test('POST', function (assert) {
    assert.plan(3)
    var post = { title: 'Foo bar', content: 'lorem ipsum' }

    makeRequest('POST', '/api/v1/post', post, function (body, res) {
      assert.equal(res.statusCode, 200)
      assert.equal(post.title, body.data.title)
      assert.equal(post.content, body.data.content)
    })
  })

  t.test('GET and middleware', function (assert) {
    assert.plan(2)

    makeRequest('GET', '/api/v1/post', null, function (body, res) {
      assert.equal(res.statusCode, 200)
      assert.equal(res.headers['awesome-header'], 'Header set')
    })
  })

  t.test('GET /:id', function (assert) {
    assert.plan(3)
    var post = { title: 'Foo bar wow', content: 'lorem ipsum' }

    makeRequest('POST', '/api/v1/post', post, function (body, res) {
      makeRequest('GET', '/api/v1/post/' + body.data.id, null, function (body, res) {
        assert.equal(res.statusCode, 200)
        assert.equal('Foo bar wow', body.title)
        assert.equal('lorem ipsum', body.content)
      })
    })
  })

  t.test('PUT', function (assert) {
    assert.plan(4)
    var post = { title: 'Foo bar wow', content: 'lorem ipsum' }

    makeRequest('POST', '/api/v1/post', post, function (body, res) {
      post.title = 'New Foo Title'
      assert.equal('Foo bar wow', body.data.title)
      makeRequest('PUT', '/api/v1/post/' + body.data.id, post, function (body, res) {
        assert.equal(res.statusCode, 200)
        assert.equal('New Foo Title', body.data.title)
        assert.equal('lorem ipsum', body.data.content)
      })
    })
  })

  t.test('DELETE', function (assert) {
    assert.plan(3)
    var post = { title: 'Foo bar wow', content: 'lorem ipsum' }

    makeRequest('POST', '/api/v1/post', post, function (body, res) {
      assert.equal(res.statusCode, 200)
      var id = body.data.id
      makeRequest('DELETE', '/api/v1/post/' + id, null, function (body, res) {
        assert.equal(res.statusCode, 200)
        makeRequest('GET', '/api/v1/post/' + id, null, function (body, res) {
          assert.equal(res.statusCode, 404)
        })
      })
    })
  })

  t.test('overwrite', function (assert) {
    assert.end()
  })

  t.test('middleware can cancel request', function (assert) {
    makeRequest('GET', '/api/v1/post/fake', null, function (body, res) {
      assert.equal(res.statusCode, 500)
      assert.equal(body.message, 'What are you doing?')
      t.end()
    })
  })

  function makeRequest (method, route, data, cb) {
    var req = http.request({ port: 8080, method: method, path: route, headers: {'Content-Type': 'application/json'} }, function (res) {
      res.on('error', function (err) {
        t.error(err)
      })
      var body = []
      res.on('data', function (chunk) {
        body.push(chunk)
      })
      res.on('end', function () {
        var bodyString = body.toString()
        cb(bodyString ? JSON.parse(bodyString) : '{}', res)
      })
    })
    req.on('error', function (err) {
      t.error(err)
    })
    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  }
})

tape('teardown', function (t) {
  server.close()
  t.end()
})
