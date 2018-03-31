<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(val,ind) in dots" :class="{active:currentPageIndex===ind}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from "better-scroll"
    export default {
        data(){
            return {
                dots:[],
                currentPageIndex:0,
                // 是否第一次加载开关
                offon:true,
            }
        },
        // BScroll的配置,通过props在外部控制
        props: {
            // loop autoPlay interval都是bscroll的设置值
            loop: {
                type: Boolean,
                default: true
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            interval: {
                type: Number,
                default: 4000
            },
            mylen:Number
            
        },
        mounted(){
            console.log('slider开始了',this.mylen)
            // 浏览器会自动刷新一般是在17ms左右所以设置小了没用
            setTimeout(()=>{
                // 进入到组件证明recommend获取数据成功,不用担心轮播图div还没生成
                this._setSliderwidth()
                this._initDots()
                this._initSlider()

                if (this.autoPlay) {
                    this._play()
                }
                
            },20)
            // 当页面尺寸改变是重新计算slider宽度
            window.addEventListener('resize',()=>{
                // 如果还没初始化slider就退出
                if (!this.slider)return
                this._setSliderwidth()
            })
        },
        destroy(){
            // 释放内存
            clearTimeout(this.timer)
        },
        methods:{
            _setSliderwidth(){
                this.children=[...this.$refs.sliderGroup.children]
                let width=0
                let sliderWidth=this.$refs.slider.offsetWidth
                this.children.forEach((val,ind)=>{
                    if (!val.classList.contains('slider-item')) {
                        val.classList.add('slider-item')
                    }
                    val.style.width=sliderWidth+'px'
                    width+=sliderWidth
                })
                // 这里加两个是还没initSlider还没添加两个div盒子
                if (this.loop&&this.offon) {
                    width+=2*sliderWidth
                    // 关闭开关
                    this.offon=false
                }
                this.$refs.sliderGroup.style.width=width+'px'
                
            },
            _initSlider(){
                this.slider = new BScroll(this.$refs.slider, {
                    // 是否开启横向滚动
                    scrollX: true,
                    scrollY: false,
                    // 当快速滑动时是否开启滑动惯性
                    momentum: false,
                    // 该属性是给 slider 组件使用的，普通的列表滚动不需要配置
                    snap: true,
                    // 是否可以无缝循环轮播
                    snapLoop: this.loop,
                    // 用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
                    snapThreshold: 0.5,
                    //  轮播图切换的动画时间
                    snapSpeed: 100,
                    // click:true
                })
                // BScroll自带的滑动后触发的事件
                this.slider.on('scrollEnd',()=>{
                    // BScroll获取当前页码方法
                    let pageIndex=this.slider.getCurrentPage().pageX
                    if (this.loop) {
                        pageIndex-=1
                    }
                    this.currentPageIndex=pageIndex
                    if (this.autoPlay) {
                        this._play()
                    }
                })
                // BScroll自带滑动前触发的事件,解决快速拉动后定时器相加的bug
                this.slider.on('beforeScrollStart',()=>{
                    if (this.autoPlay) {
                        clearTimeout(this.timer)
                    }
                })

            },
            _initDots(){
                this.dots=new Array(this.children.length)
            },
            _play(){
                let pageIndex=this.currentPageIndex+1
                if (this.loop) {
                    pageIndex+=1
                }
                // let len=this.children.length
                this.timer = setTimeout(() => {
                    // goToPage是better-scroll内置方法
                this.slider.goToPage(pageIndex, 0, 400)
                }, this.interval)
            }

        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
    min-height: 1px;

    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;

        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;

            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
            }

            img {
                display: block;
                width: 100%;
            }
        }
    }

    .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 12px;
        text-align: center;
        font-size: 0;

        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;

            &.active {
                width: 20px;
                border-radius: 5px;
                background: $color-text-ll;
            }
        }
    }
}
</style>