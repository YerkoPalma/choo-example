function reducer (state, action) {
  state = state || {}
  switch (action.type) {
    case 'SET_POSTS':
      state.posts = action.data
      return state
    case 'ADD_POST':
      var posts = state.posts || []
      posts.push(action.data)
      state.posts = posts
      return state
    default:
      return state
  }
}
module.exports = reducer
