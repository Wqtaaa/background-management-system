<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      num: 1,
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>
<style lang="less">
html,
body,
h3,
p {
  margin: 0;
  padding: 0;
}
</style>
