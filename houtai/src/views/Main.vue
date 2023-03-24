<template>
  <div>
    <el-container>
      <el-aside width="auto">
        <CommonAside />
      </el-aside>
      <el-container>
        <el-header>
          <CommonHeader />
        </el-header>
        <CommonTag />
        <el-main>
          <!-- 路由出口 -->
          <router-view>
            <!-- 路由匹配到的组件将会渲染在这里  -->
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CommonHeader from "../components/CommonHeader.vue";
import CommonAside from "../components/CommonAside.vue";
import CommonTag from "../components/CommonTag.vue";
export default {
  data() {
    return {};
  },
  components: {
    CommonAside,
    CommonHeader,
    CommonTag,
  },
};
</script>

<style scoped>
.el-header {
  padding: 0;
}
</style>