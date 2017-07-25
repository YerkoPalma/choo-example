var html = require('bel')

function homView (params, store) {
  var posts = store.getState().posts || []
  return html`<section class="mw7 center avenir">
  <h2 class="baskerville fw1 ph3 ph0-l">News 
    <a data-route="/new" class="pointer f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box">
      <span class="pr1">Add post</span>
      <svg class="w1" data-icon="chevronRight" viewBox="0 0 32 32" style="fill:currentcolor">
        <title>chevronRight icon</title>
        <path d="M12 1 L26 16 L12 31 L8 27 L18 16 L8 5 z" />
      </svg>
    </a>
  </h2>
  ${posts.length === 0 ? 'No posts yet' : ''}
  ${posts.map(function (post) {
    return html`<article class="bt bb b--black-10">
    <a class="db pv4 ph3 ph0-l no-underline black dim pointer" data-route="/${post.id}">
      <div class="flex flex-column flex-row-ns">
        <div class="w-100 pl3-ns">
          <h1 class="f3 fw1 baskerville mt0 lh-title">${post.title}</h1>
          <p class="f6 f5-l lh-copy">
            ${post.subtitle}
          </p>
          <p class="f6 lh-copy mv0">${post.date}</p>
        </div>
      </div>
    </a>
  </article>`
  })}
</section>`
}
module.exports = homView
