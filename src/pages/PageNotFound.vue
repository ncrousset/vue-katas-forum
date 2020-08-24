<template>
    <div class="col-full" :class="$style.centered">
      <h1 :class="$style.headingLange">Not Found</h1>
      <p :class="$style.textLarge">
        Oooops, we couldn't find what you are looking for. Why don't you
        <router-link :to="{name: 'Home'}">go home instead?</router-link>
      </p>
    </div>
</template>

<script>
  export default {
    name: 'PageNotFound'
  }
</script>

<style module>

  .headingLange {
    font-size: 100px;
  }

  .textLarge{
    font-size: 50px;
    font-weight: 100;
  }

  .centered {
    text-align: center;
  }
</style>
