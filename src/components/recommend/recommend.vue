<template>
  <div class="recommend">
    <!-- 加入动态数据让scroll组件内监听再次refresh,通过数据改变操作再次刷新 -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!-- Bscroll只滚动第一个字盒子 -->
      <div>
          <!-- 通过v-if判断数据是否加载了决定是否渲染slider组件才会执行slider组件的mounted -->
          <!-- 该父盒子宽度等于屏幕宽度 移动子盒子 -->
          <div v-if="recommends.length" class="slider-wrapper">
            <!--:mylen="recommends.length"自己测试父级传给子级 属性  -->
            <slider :mylen="recommends.length" >
              <div  v-for="item in recommends">
                <a :href="item.linkUrl">
                  <!-- 加入img.onload去再次初始化 -->
                  <!-- 若因为slider嵌套在scroll里面 slider可能会点击不了,给要点击的dom元素添加class="needsclick" -->
                  <!-- fastclick会监听若有needsclick 不会拦截点击,从而解决fastclick与Bscroll冲突 -->
                  <img class="needsclick" @load="loadImage" :src="item.picUrl" alt="">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list" v-show="discList.length">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="item in discList" class="item" @click="selectItem(item)">
                <div class="icon">
                    <img width="60" height="60" v-lazy="item.imgurl">
                  </div>
                  <div class="text">
                    <h2 class="name" v-html="item.creator.name"></h2>
                    <p class="desc" v-html="item.dissname"></p>
                  </div>
              </li>
            </ul>
          </div>
      </div>
      <!-- loading组件 -->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import Loading from'base/loading/loading'
  // 引用调用api
  import {getRecommend,getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  export default{
    data(){
      return {
        recommends:[],
        discList:[]
      }
    },
    created(){
      this._getRecommend()
      setTimeout(() => {
        
        this._getDiscList()
      }, 2000);
    },

    methods:{
      _getRecommend(){
        getRecommend().then((res)=>{
            if (res.code===ERR_OK) {
              this.recommends=res.data.slider
            }
        })
      },
      _getDiscList(){
        getDiscList().then((res)=>{
            if (res.code===ERR_OK) {
              this.discList=res.data.list
              console.log(this.discList)
            }
        })
      },
      selectItem(item){
        console.log(item.dissid)
      },
      loadImage(){
        if (!this.checkLoad) {
          this.$refs.scroll.refresh()
          this.checkLoad=true
        }
      }
    },
    components:{
      Slider,
      Scroll,
      Loading
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>