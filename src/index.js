var Router = require('singleton-router')
var css = require('sheetify')
var html = require('bel')
var nanomorph = require('nanomorph')
var createStore = require('redux').createStore
var reducer = require('./store/reducer')
var homeView = require('./views/home')
var postView = require('./views/post')
var newPostView = require('./views/new-post')
var getAllPosts = require('./store/actions').getAllPosts

css('tachyons')

var router = Router()
var store = createStore(reducer)
store.subscribe(render)

router.setStore(store)
router.addRoute('/', homeView)
router.addRoute('/new', newPostView)
router.addRoute('/:post', postView)
router.notFound(notFoundView)
router.setRoot('/')
router.start()

getAllPosts(store)
function notFoundView (params, state) {
  return html`<main>
    <h1>ups! nothing here :(</h1>
  </main>`
}

function render (prev, curr) {
  var _prev = router.rootEl.lasttElementChild || router.rootEl.lastChild
  var _curr = router.currentRoute.onStart(store)
  console.log('updated state to: ' + JSON.stringify(store.getState()))
  nanomorph(_prev, _curr)
}
