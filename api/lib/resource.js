var path = require('path')

function resource (app, stack) {
  return function (model, opt) {
    var prefix = '/api/v' + (opt.version || '1')
    var route = opt.path
    // index, create
    app.route(['GET', 'POST'], path.join(prefix, route), handler())
    // show, update, delete
    app.route(['GET', 'PUT', 'DELETE'], path.join(prefix, route, '/:id'), handler())

    if (opt.overwrite && Array.isArray(opt.overwrite)) {
      opt.overwrite.map(function (overwrite) {
        app.route(overwrite.method, overwrite.route, handler(overwrite.handler))
      })
    }
    function handler (fn) {
      return function (req, res, ctx) {
        var dispatcher = fn || dispatch(model)
        if (stack && stack._middleware.length > 0) {
          ctx.ondone = function (err) {
            if (err) throw err
          }
          stack.walk(ctx, function (err, data) {
            if (err) {
              if (err.code && err.message) {
                ctx.send(err.code, { message: err.message })
              } else if (err instanceof Error) {
                ctx.send(500, { message: err.message })
              } else {
                ctx.send(500, { message: 'Unknown error' })
              }
            } else {
              dispatcher(req, res, ctx)
            }
          })
        } else {
          dispatcher(req, res, ctx)
        }
      }
    }
  }
}
function dispatch (model) {
  return function (req, res, ctx) {
    model.dispatch(req, Object.assign({ valueEncoding: 'json' }, ctx.params), function (err, data) {
      if (err) {
        if (err.notFound) {
          ctx.send(404, { message: 'resource not found' })
        } else {
          ctx.send(500, { message: 'internal server error' })
        }
      } else {
        if (!data) {
          if (req.method !== 'DELETE') {
            ctx.send(404, { message: 'resource not found' })
          } else {
            ctx.send(200, { id: ctx.params.id }, { 'content-type': 'json' })
          }
        } else {
          ctx.send(200, JSON.stringify(data), { 'content-type': 'json' })
        }
      }
    })
  }
}
module.exports = resource
module.exports.dispatch = dispatch
