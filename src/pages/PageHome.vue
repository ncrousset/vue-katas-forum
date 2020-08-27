<template>
  <div class="col-full">
    <h1>Welcome to the Forum</h1>
    <ForumList :forums="forums"/>
  </div>
</template>

<script>
  import sourceData from '@/data'
  // import ThreadList from '../components/ThreadList'
  import ForumList from '../components/ForumList'

  console.log(sourceData)

  export default {
    name: 'HelloWorld',

    components: {
      ForumList
    },

    data () {
      return {
        forums: Object.values(sourceData.forums),
        posts: sourceData.posts,
        users: sourceData.users

      }
    }
  }
</script>
