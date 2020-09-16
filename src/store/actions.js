import firebase from 'firebase'

export default {
  createPost ({commit, state}, post) {
    const postId = firebase.database().ref('posts').push().key
    post.publishedAt = Math.floor(Date.now() / 1000)
    post.userId = state.authId

    const updates = {}
    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
    updates[`users/${post.userId}/posts/${postId}`] = postId
    firebase.database().ref().update(updates)
      .then(() => {
        commit('setItem', {resource: 'posts', item: post, id: postId})
        commit('appendPostToThread', {parentId: post.threadId, childId: postId})
        commit('appendContributorsToThread', {parentId: post.threadId, childId: post.userId})
        commit('appendPostToUser', {parentId: post.userId, childId: postId})
        return Promise.resolve(state.posts[postId])
      })
  },

  updateThread ({commit, state, dispatch}, {title, text, id}) {
    return new Promise((resolve, reject) => {
      const thread = state.threads[id]
      const newThread = {...thread, title}

      commit('setThread', {thread: newThread, threadId: id})

      dispatch('updatePost', {id: thread.firstPostId, text})
        .then(() => {
          resolve(newThread)
        })
    })
  },

  createThread ({state, commit, dispatch}, {text, title, forumId}) {
    return new Promise((resolve, reject) => {
      const threadId = firebase.database().ref('threads').push().key
      const postId = firebase.database().ref('posts').push().key
      const publishedAt = Math.floor(Date.now() / 1000)
      const userId = state.authId

      const thread = {title, forumId, publishedAt, userId, firstPostId: postId, posts: {}}
      thread.posts[postId] = postId
      const post = {text, publishedAt, threadId, userId}

      const updates = {}
      updates[`threads/${threadId}`] = thread
      updates[`forums/${forumId}/threads/${threadId}`] = threadId
      updates[`users/${userId}/threads/${threadId}`] = threadId
      updates[`posts/${postId}`] = post
      updates[`users/${userId}/posts/${postId}`] = postId
      firebase.database().ref().update(updates)
        .then(() => {
          // update thread
          commit('setItem', {resource: 'threads', id: threadId, item: thread})
          commit('appendThreadToForum', {parentId: forumId, childId: threadId})
          commit('appendThreadToUser', {parentId: userId, childId: forumId})
          // update post
          commit('setItem', {resource: 'posts', item: post, id: postId})
          commit('appendPostToThread', {parentId: post.threadId, childId: postId})
          commit('appendPostToUser', {parentId: post.userId, childId: postId})

          resolve(state.threads[threadId])
        })
    })
  },

  updatePost ({state, commit}, {id, text}) {
    return new Promise((resolve, reject) => {
      const post = state.posts[id]
      commit('setPost', {
        postId: id,
        post: {
          ...post,
          text,
          edited: {
            at: Math.floor(Date.now() / 1000),
            by: state.authId
          }
        }
      })
      resolve(post)
    })
  },
  updateUser: ({commit}, user) => commit('setUser', {userId: user['.key'], user}),
  fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id, emoji: '🎲'}),
  fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'users', id, emoji: '👩🏼‍🦰'}),
  fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id, emoji: '🏷'}),
  fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'posts', id, emoji: '📫'}),
  fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'forums', id, emoji: '🗒'}),
  fetchForums: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'forums', emoji: '🧧', ids}),
  fetchPosts: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'posts', emoji: 'chat', ids}),
  fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'threads', emoji: '🗂', ids}),

  fetchAllCategories ({state, commit}) {
    console.log('🙈', '💳', 'all')
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categoriesObject = snapshot.val()
        Object.keys(categoriesObject).forEach(categoryId => {
          const category = categoriesObject[categoryId]
          commit('setItem', {resource: 'categories', id: categoryId, item: category})
        })
      })
      resolve(Object.values(state.categories))
    })
  },

  fetchItem ({state, commit}, {id, emoji, resource}) {
    console.log('💡‍', emoji, id)
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
        resolve(state[resource][id])
      })
    })
  },

  fetchItems ({dispatch}, {ids, resource, emoji}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource, emoji})))
  }
}
