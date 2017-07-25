var html = require('bel')

function homView (params, store) {
  var post = store.getState().posts.filter(function (p) {
    return p.id === params.post
  })[0]
  return html`<article class="helvetica cf ph3 ph5-ns pv5">
  <header class="fn fl-ns w-50-ns pr4-ns">
    <h1 class="f2 lh-title fw9 mb3 mt0 pt3 bt bw2">
      ${post.title}
    </h1>
    <h2 class="f3 mid-gray lh-title">
      ${post.subtitle}
    </h2>
    <time class="f6 ttu tracked gray">${post.date}</time>
  </header>
  <div class="fn fl-ns w-50-ns">
    <p class="f5 lh-copy measure mt0-ns">
      ${post.content}
    </p>
  </div>
</article>`
}
module.exports = homView
