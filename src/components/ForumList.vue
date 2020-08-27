<template>
  <div>
    <ForumListItem
      v-for="forum in forums"
      :forum="forum"
      :key="forum['.key']"
    />
  </div>
</template>

<script>
  import ForumListItem from './ForumListItem'
  export default {
    props: {
      forums: {
        required: true,
        type: Array
      }
    },
    components: {
      ForumListItem
    }

  }
</script>

<style scoped>

</style>
