<template>
  <div class="tabs">
    <el-tag
      v-for="(item, index) in tags"
      :key="item.path"
      :closable="item.name !== 'home'"
      :effect="item.name === $route.name ? 'dark' : 'plain'"
      @click="changeMenu(item)"
      @close="handleClose(item, index)"
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "CommonTag",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  methods: {
    ...mapMutations(["closeTag"]),
    //点击tag跳转的功能
    changeMenu(item) {
      //法1，使用item的路径进行跳转
      //   this.$router.push(item.path);
      // 法2，使用item的name进行跳转，需要以对象形式传入
      this.$router.push({ name: item.name });
    },
    handleClose(item, index) {
      this.closeTag(item);
      const nowtailIndex = this.tags.length - 1;
      if (item.name !== this.$route.name) {
        return;
      } else {
        if (index == nowtailIndex + 1) {
          //表示删除的是最后一个元素
          this.$router.push({ name: this.tags[index - 1].name });
        } else {
          //删除的是中间元素，则push至原item的下一个item，
          //(原来的index，在删除后的数组中刚好是下一个item的索引)
          this.$router.push({ name: this.tags[index].name });
        }
      }
    },
  },
};
</script>

<style lang="less">
.tabs {
  padding: 20px;
  .el-tag {
    margin-right: 20px;
    cursor: pointer;
  }
}
</style>