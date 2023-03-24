<template>
  <el-row>
    <!-- 左侧1/3 -->
    <el-col :span="8" style="padding-right: 10px">
      <!-- 左侧 -->
      <!-- 左上用户信息卡片 -->
      <el-card class="box-card">
        <!-- 用户信息区 -->
        <div class="user">
          <img src="../assets/Jay.webp" alt="" />
          <div class="userinfo">
            <p class="name">Jay-Chou</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <!-- 登陆信息区 -->
        <div class="login-info">
          <p>上次登陆的时间<span>2023-2-15</span></p>
          <p>上次登陆的IP地址<span>中国台湾</span></p>
        </div>
      </el-card>
      <!-- 左下商品列表信息卡片 -->
      <el-card style="margin-top: 20px; height: 460px">
        <el-table :data="tableData" style="width: 100%">
          <!-- v-for 那个in的前面离(v,k)要有一个空格,不然会报错 -->
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          />
          <!-- 一开始表头信息没出来,通过检查发现label写错了,写成了lable -->
          <!-- <el-table-column prop="name" label="姓名"> </el-table-column>

          <el-table-column prop="年龄" label="年龄"> </el-table-column>
          <el-table-column prop="relation" label="与强哥的关系">
          </el-table-column> -->
        </el-table>
      </el-card>
    </el-col>
    <!-- 右侧2/3-->
    <el-col :span="16" style="padding-left: 10px">
      <!--右上订单信息区  -->
      <div class="num">
        <el-card
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <i
            class="icon"
            :class="`el-icon-${item.icon}`"
            v-bind:style="{ background: item.color }"
          ></i>
          <!-- :class前面也要有一个空格 -->
          <div class="detail">
            <p class="price">{{ item.value }}</p>
            <p class="desc">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 右中折线图 -->
      <el-card style="height: 280px">
        <div ref="echarts1" style="height: 280px"></div>
      </el-card>
      <!-- 右下图表区 -->
      <div class="graph">
        <el-card style="height: 260px">
          <!-- 右下柱状图 -->
          <div ref="echarts2" style="height: 260px"></div>
        </el-card>
        <el-card style="height: 260px">
          <div ref="echarts3" style="height: 220px">
            <!-- 右下饼状图 -->
          </div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { getData } from "../api";
import * as echarts from "echarts";

export default {
  mounted() {
    getData().then(({ data }) => {
      const { tableData } = data.data;
      // 相当于const { tableData: tableData } = data.data;
      // 这里使用了对象形式的结构赋值
      this.tableData = tableData;
      //基于准备好的dom节点,初始化echarts实例
      const echarts1 = echarts.init(this.$refs.echarts1);
      //指定图表的配置项和数据
      var echarts1Option = {};
      // 解构赋值,为将来三种图表所需的数据做铺垫
      const { orderData, userData, videoData } = data.data;
      //处理数据xAxis
      const xAxis = Object.keys(orderData.data[0]);
      // console.log(xAxis);
      const xAxisData = { data: xAxis };
      echarts1Option.xAxis = xAxisData;
      echarts1Option.legend = xAxisData;
      echarts1Option.yAxis = {};

      console.log(data);
      echarts1Option.series = [];
      console.log(echarts1Option);
      xAxis.forEach((key) => {
        echarts1Option.series.push({
          name: key,
          data: orderData.data.map((item) => item[key]),
          type: "line",
        });
      });
      // 使用刚指定的配置项和数据显示图表
      echarts1.setOption(echarts1Option);
      //柱状图
      const echarts2 = echarts.init(this.$refs.echarts2);
      const echarts2Option = {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: "#333",
          },
        },
        grid: {
          left: "20%",
        },
        // 提示框
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category", // 类目轴

          data: userData.map((item) => item.date),
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
          axisLabel: {
            interval: 0,
            color: "#333",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
          },
        ],
        color: ["#2ec7c9", "#b6a2de"],
        series: [
          {
            name: "新增用户",
            data: userData.map((item) => item.new),
            type: "bar",
          },
          {
            name: "活跃用户",
            data: userData.map((item) => item.active),
            type: "bar",
          },
          // type属性(以及name,data)这些都要写成对象里面的键值对,因此不能把冒号用成等号
          // css里面设置样式也是k:v,没有用=号,一个等号是赋值符号
        ],
      };
      echarts2.setOption(echarts2Option);
      // 饼状图
      const echarts3 = echarts.init(this.$refs.echarts3);
      const echarts3Option = {
        tooltip: {
          trigger: "item",
        },
        color: [
          "#0f78f4",
          "#dd536b",
          "#9462e5",
          "#a6a6a6",
          "#e1bb22",
          "#39c362",
          "#3ed1cf",
        ],
        series: [
          {
            data: videoData,
            type: "pie",
          },
        ],
      };
      echarts3.setOption(echarts3Option);
    });
  },
  data() {
    return {
      // tableData: [
      //   { name: "高启盛", relation: "弟弟", age: "25" },
      //   { name: "高启兰", relation: "妹妹", age: "23" },
      //   { name: "安欣", relation: "警察,老对头", age: "30" },
      //   { name: "高启兰", relation: "妹妹", age: "23" },
      //   { name: "唐小龙", relation: "一把手", age: "28" },
      //   { name: "唐小虎", relation: "二把手", age: "27" },
      //   { name: "陈书婷", relation: "妻子", age: "32" },
      // ],
      // tableLable: {
      //   name: "姓名",
      //   age: "年龄",
      //   relation: "与强哥的关系",
      // },

      // tableLable: {
      //   brand: "手机品牌",
      //   todaySale: "今日销量",
      //   monthSale: "本月销量",
      //   return: " 退货数量",
      // },

      tableData: [],
      tableLabel: {
        name: "课程",
        todayBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
      },
      countData: [
        {
          name: "今日支付订单",
          value: 586,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单",
          value: 3222,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "今日未支付订单",
          value: 2123,
          icon: "s-goods",
          color: "#5ab1ef",
        },
        {
          name: "本月支付订单",
          value: 5231,
          icon: "success",
          color: "#5ab1ef",
        },
        {
          name: "本月收藏订单",
          value: 32223,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "本月未支付订单",
          value: 53231,
          icon: "s-goods",
          color: "#5ab1ef",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.user {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-right: 40px;
  }
  .userinfo {
    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }
    .access {
      color: #999999;
    }
  }
}
.login-info {
  padding-left: 40px;
  p {
    line-height: 28px;
    font-size: 14px;
    color: #999999;
    span {
      color: #666666;
      margin-left: 60px;
    }
  }
}
.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // 这里给el-card标签设置样式,要用类选择器而不是标签选择器
  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
  .icon {
    width: 80px;
    height: 80px;
    font-size: 30px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }
  .detail {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .price {
      font-size: 30px;
      margin-bottom: 10px;
      line-height: 30px;
      height: 30px;
    }
    .desc {
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }
}
.graph {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  .el-card {
    width: 48%;
  }
}
</style>