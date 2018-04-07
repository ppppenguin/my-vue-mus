<template>
    <!-- 记住在scroll外层要包一个盒子 position为absolute 或者fixed -->
    <!-- 这个ref是为了用scroll的内置方法scrollTo -->
    <scroll class="listview" ref="listview" :data="data"
            :probe-type="probeType" 
            :listen-scroll="listenScroll"
            @scroll="listViewScroll">
        <!-- 住列表 -->
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h4 class="list-group-title">{{group.title}}</h4>
                <ul>
                    <li v-for="item in group.items" class="list-group-item">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
            <div class="fixed-title">{{fixedTitle}} </div>
        </div>
        <!-- 右边列表 -->
        <ul class="list-shortcut" @touchstart.prevent.deflaut="onShortcutTouchStart"
                                @touchmove.prevent.default="onShortcutTouchMove"
                                v-show="data.length">
            <!-- 通过计算属性获取标题第一个字 -->
            <li class="item"  v-for="(item,ind) in shortcutList" 
                            :class="{'current':currentIndex==ind}" 
                            :data-ind="ind" >
                {{item}}
            </li>
        </ul>
        <!-- 父盒子高度就只有屏幕高度-顶部top值 -->
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>

<script>
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'
    // 右侧li的高度
    const ANCHOR_HEIGHT = 18
    const FIXED_TITLE=30

    export default {
        data() {
            return {
                currentIndex: 0,
                listHeight:[],
                touch:{},
                scrollY:-1
            }
        },
        props: {
            data: {
                type: Array,
                default: [],
            },
            
        },
        computed: {
            shortcutList() {
                return this.data.map((group) => {
                return group.title.substr(0, 1)
                })
            },
            fixedTitle(){
                if (this.scrollY>0) {
                    return ''
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        created(){
            this.probeType = 3
            this.listenScroll = true
        },
        methods:{
            // 触摸事件
            onShortcutTouchStart($e){
                let anchorIndex=$e.target.dataset['ind']
                if (!anchorIndex) {
                    return}
                // 获取触摸的第一个手指
                let firstTouch = $e.touches[0]
                // 将y1.y2 anchorIndex放入touch里面 比较有语意
                this.touch.y1=firstTouch.pageY
                // this.currentIndex=anchorIndex  这个currentIndex应该要跟着scroll滚动事件来
                this.touch.anchorIndex=anchorIndex
                this._scrollTo(anchorIndex)
            },
            // 触摸移动事件
            onShortcutTouchMove($e){               
                let firstTouch = $e.touches[0]
                this.touch.y2=firstTouch.pageY
                // 获取移动了多少个格子两种向下取整的方式 |0  或者~~()
                // let gap=~~((this.scrollStartY-this.scrollMoveY)/ANCHOR_HEIGHT)
                let gap=(this.touch.y1-this.touch.y2)/ANCHOR_HEIGHT|0
                let ind=this.touch.anchorIndex-gap
                // 限制滑动时超出最上和最下部分
                ind<0&&(ind=0)
                ind>this.listHeight.length-2&&(ind=this.listHeight.length-2)
                this._scrollTo(ind)
            },
            // 监测data数据,变化就重新计算
            _calculateHeight(){
                this.listHeight=[0]
                let height=0
                // 计算每个li距离ul的顶部距离
                let ligroup=[...this.$refs.listGroup]
                ligroup.forEach((val,ind)=>{
                    height+=val.offsetHeight
                    this.listHeight.push(height)
                })
            },
            _scrollTo(index){
                this.currentIndex=index
                // 这里没scrollToElement方法因为这是Bscroll实例的方法 不是Bscroll组件的方法
                // 要在Bscroll的methods里添加方法
                this.scrollY=-this.listHeight[index]
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
            },
            listViewScroll(pos){
                // 设置给scrollY 然后监测scrollY变化然后改变this.currentIndex
                this.scrollY=pos.y
            }
        },
        components:{
            Scroll,
            Loading
        },
        watch: {
            data() {
                setTimeout(() => {
                    this._calculateHeight()
                }, 20);
            },
            scrollY(newY){

                const listHeight = this.listHeight
                // 滑动到最顶部还往下拉时
                if (newY>0) {
                    this.currentIndex=0
                    return
                }//滑动到嘴底部还往下拉时
                else if (newY<-listHeight[listHeight.length-2]) {
                    this.currentIndex=listHeight.length-2
                    return
                }
                // 在中间部分时
                for (let i = 0; i < listHeight.length-1; i++) {
                    if (-newY>=listHeight[i]&&-newY<=listHeight[i+1]) {
                        this.currentIndex=i
                        // 在刚好下一个title到达顶部固定的底部时
                        if (-newY>=listHeight[i+1]-FIXED_TITLE) {
                            // console.log(FIXED_TITLE-(listHeight[i+1]+newY))
                            this.$refs.fixed.style['top']=`-${FIXED_TITLE-(listHeight[i+1]+newY)}px`
                        }else{
                            this.$refs.fixed.style['top']=`0px`
                        }
                        
                        return
                    }
                }
                
            },
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
