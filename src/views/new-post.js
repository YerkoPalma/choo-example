var html = require('choo/html')
// var addPost = require('../store/actions').addPost

function homView (state, emit) {
  return html`<div class="mw7 center avenir">
    <form class="pa4 black-80" onsubmit="${function (e) {
      e.preventDefault()
      var post = {
        title: document.getElementById('title').value,
        subtitle: document.getElementById('subtitle').value,
        content: document.getElementById('content').value,
        date: Date.now().toLocaleString()
      }
      emit('addPost', post)
    }}">
    <div class="center measure-wide">
      <label for="title" class="f6 b db mb2">Title</label>
      <input id="title" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" aria-describedby="title-desc">
      <small id="title-desc" class="f6 black-60 db mb2">Required</small>
    </div>
    <div class="center measure-wide">
      <label for="subtitle" class="f6 b db mb2">Subitle</label>
      <input id="subtitle" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text">
    </div>
    <div class="center measure-wide">
      <label for="content" class="f6 b db mb2">Content</label>
      <textarea id="content" name="content" class="db vh-50 border-box hover-black w-100 ba b--black-20 pa2 br2 mb2" aria-describedby="content-desc"></textarea>
      <small id="content-desc" class="f6 black-60">Required</small>
    </div>
    <div class="center measure-wide">
      <input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Submit">
    </div>
  </form>
</div>`
}
module.exports = homView
