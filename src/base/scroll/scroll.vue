<template>
  <div  ref="wrapper">
      <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from "better-scroll"
    export default {
        data(){
            return {
                
            }
        },
        // BScroll的配置,通过props在外部控制
        props: {
           click:{
               type:Boolean,
               default:true
           },
           probeType:{
               type:Number,
               default:1
           },
           listenScroll:{
               type:Boolean,
               default:false
           },
           data:{
               type:Array,
               default:null
           }
        },
        mounted(){
            setTimeout(()=>{
                this._initScroll();
            },20)
        },
        methods:{
            _initScroll(){
                if (!this.$refs.wrapper) {
                    return
                }
                // 注册BScroll
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click
                })
                // 若listenScroll设置为true 就打开滚动事件
                if (this.listenScroll) {
                    // 子组件要向父组件发送广播
                    let me=this
                    this.scroll.on('scroll', (pos) => {
                    me.$emit('scroll',pos)  
                    })
                }
            },
            // 下面的都是Bscroll内置的方法
            refresh(){
                this.scroll&&this.scroll.refresh()
            },
            enable(){
                this.scroll&&this.scroll.enable()
            },
            disable(){
                this.scroll&&this.scroll.disable()
            },
            scrollTo(y){
                this.scroll.scrollTo(0,y)
            },
            scrollToElement(ele,time){
                this.scroll.scrollToElement(ele,time)
            },
            
        },
        watch:{
            data(){
                setTimeout(()=>{
                this._initScroll();
                },20)
            }
        }
    }
</script>

