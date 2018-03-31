<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 添加keep-alive可以不用重新渲染已打开的router,如没设置会重新执行recommend的created钩子的数据请求 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'

  export default{
    // 引入的组件 需要在components注册
    components: {
      MHeader,
      Tab
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
