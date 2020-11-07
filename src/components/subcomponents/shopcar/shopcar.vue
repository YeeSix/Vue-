<template>
<div>
    <div id="shopcar-container">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{ totalCount }}</div>
                </div>
                <div class="price" :class="{'highlight':totalPrice>0}">￥{{ totalPrice }}</div>
                <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
            </div>
            <div class="content-right" :class="payClass" @click.stop.prevent="pay">
                {{payDesc}}
            </div>
        </div>
        <div class="ball-container">
            <div v-for="(ball,i) in balls" :key="i">
                <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div class="ball" v-show="ball.show">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </div>
        </div>
        <transition name="fold">
            <div class="shopcar-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="(food,i) in selectFoods" :key="i">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{ food.price*food.count }}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>

    <transition name="fade">
        <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
</div>
</template>

<script>
import cartcontrol from '../cartcontrol/cartcontrol'
import BScroll from 'better-scroll'

export default {
    data(){
        return{
            // 设置小球数组是防止点击速度很快时,没有小球可以显示,防止等待
            balls: [
                {
                  show: false
                },
                {
                  show: false
                },
                {
                  show: false
                },
                {
                  show: false
                },
                {
                  show: false
                }
            ],
            dropBalls: [],
            fold:true
        }
    },
    methods:{
        drop(target){ //此处el是父组件传过来的点击加号的位置target
            for(let i=0; i<this.balls.length;i++){
                let ball = this.balls[i];
                if(!ball.show){
                    ball.show=true;
                    ball.el=target;
                    this.dropBalls.push(ball);//便于在afterEnter处拿到小球 设置小球状态
                    return;//此处return终结函数,这意味着每次触发事件,dropBalls内只增加一个ball
                }
            }
        },
        beforeEnter(el){
            let count = this.balls.length;
            while(count--){
                let ball =this.balls[count];
                if(ball.show){ 
                    // 获取在drop()方法中赋值的小球的位置target
                    let ballPos = ball.el.getBoundingClientRect();
                    let x = ballPos.left -32;
                    let y = -(window.innerHeight - ballPos.top - 22-16);
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    // 由于小球运动时x与y轴方向上的运动轨迹不同，因此一个小球需要两个div组成，外层控制y轴，内层控制x轴
                    // 因为小球移动轨迹是两个方向 所以需要在定义一个盒子 内外层动画
                    // y方向使用贝塞尔曲线,x方向是匀速linear
                    el.style.display=" ";
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                    el.style.transform = `translate3d(0,${y}px,0)`;
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`; 
                    inner.style.transform = `translate3d(${x}px,0,0)`; 
                }
            }
        },
        enter(el,done){
            el.offsetHeight;//重绘html
            this.$nextTick(() => { //让动画效果异步执行,提高性能
                let inner = el.getElementsByClassName('inner-hook')[0];
                // 两方向的transform
                el.style.transform = `translate3d(0,0,0)`;
                el.style.webkitTransform = `translate3d(0,0,0)`;
                inner.style.transform = `translate3d(0,0,0)`; 
                inner.style.webkitTransform = `translate3d(0,0,0)`; 
                // 监听事件结束,调用done
                el.addEventListener('transitionend',done);
            }) 
        },
        afterEnter(el){
            let ball = this.dropBalls.shift();//完成一次动画就删除一个dropBalls的小球,否则触发N次事件
            if(ball){
                ball.show = false;
                el.style.display="none";
            }
        },
        toggleList(){
            if(!this.totalCount){
                return;
            }
            this.fold = !this.fold;
        },
        empty(){
            this.selectFoods.forEach((food) => {
                food.count=0;
            })
        },
        hideList(){// 点击 隐藏遮罩层
            this.fold=true;
        },
        pay(){
            if(this.totalPrice<this.minPrice){
                return;
            }
            alert("需要支付"+this.totalPrice + "元");
        }
    },
    created(){
      // 获取按钮组件的点击的元素，用在drop方法里 派送事件
        this.$root.$on('cart.add',this.drop);
    },
    props:['deliveryPrice','minPrice','selectFoods'],
    computed:{
        totalPrice(){//选中食物总价格
            let total = 0;
            this.selectFoods.forEach((food) =>{
                total+=food.price*food.count;
            })
            return total;
        },
        totalCount(){//选中食物的总个数
            let count = 0;
            this.selectFoods.forEach((food) =>{
                count+=food.count;
            })
            return count;
        },
        payDesc(){//去结算区块显示文字内容
            if(this.totalPrice===0){
                return `￥${this.minPrice}起送`
            }else if(this.totalPrice < this.minPrice){
                let diff = this.minPrice - this.totalPrice;
                return `还差￥${diff}起送`
            }else{
                return '去结算'
            }
        },
        payClass(){//去结算按钮显示文字样式
            if(this.totalPrice < this.minPrice){
                return 'not-enough'
            }else{
                return 'enough'
            }
        },
        listShow(){
            if(!this.totalCount){
                /* eslint-disable */
                // this.fold = true;
                return false;
            }
            let show = !this.fold;
            if(show){
                this.$nextTick(() => {
                    if(!this.scroll){
                        this.scroll = new BScroll(this.$refs.listContent,{
                            click:true
                        });
                    }else{
                        this.scroll.refresh();//若已经存在this.scroll只要刷新就可以
                    }           
                })
            }
            return show;
        }
    },
    components:{
        cartcontrol
    }
}
</script>

<style lang="scss">
#shopcar-container{
    position:fixed;
    bottom:0;
    left:0;
    height:48px;
    width:100%;
    z-index:50;
    .content{
        display:flex;
        background-color: #141d27;
        font-size:0;
        color:rgba(255,255,255,0.4);
        .content-left{
            flex:1;
            .logo-wrapper{
                display:inline-block;
                position:relative;
                top:-10px;
                box-sizing:border-box;
                margin:0 12px;
                padding:6px;
                width:56px;
                height:56px; 
                border-radius:50%;
                background-color: #141d27;
                .logo{
                    width:100%;
                    height:100%;
                    border-radius: 50%;
                    text-align: center;
                    background-color: #2b343c;
                    &.highlight{
                        background: rgb(0,160,220);
                    }
                    .icon-shopping_cart{
                        font-size:24px;
                        line-height: 44px;
                        color: #80858a;
                        &.highlight{
                            color:#fff;
                        }
                    }
                }
            }
            .num{
                position: absolute;
                top:0;
                right: 0;
                width:24px;
                height:16px;
                line-height: 16px;
                text-align: center;
                border-radius: 16px;
                box-shadow: 0 4px 8px 0px rgba(0,0,0,0.4);
                font-size: 9px;
                font-weight: 700;
                color:#fff;
                background:rgb(240,20,20);
            }
            .price,.desc{
                display:inline-block;
                vertical-align: top;
                margin-top: 12px;
                line-height: 24px;
            }
            .price{
                padding-right: 12px;
                font-size:16px;
                font-weight:700;
                border-right:1px solid rgba(255,255,255,0.1);
                &.highlight{
                    color:#fff;
                }
            }
            .desc{
                padding-left: 12px;
                font-size:10px;
            }
        }
        .content-right{
            flex:0 0 105px;
            width:105px;
            height:48px;
            line-height: 48px;
            text-align: center;
            font-size:12px;
            font-weight: 700;
            &.not-enough{
                background: #2b333b;
            }
            &.enough{
                background: #00b43c;
                color:#fff;
            }
        }
    }
    .ball{
        position:fixed;
        left:32px;
        bottom:22px;
        z-index:200;
        transition:all .4s cubic-bezier(.49,-.29,.75,.41);
        .inner{
            width:16px;
            height:16px;
            border-radius: 50%;
            background-color: rgb(0,160,220);
            transition:all .4s linear;
        } 
    }
    .shopcar-list{
        position:absolute;
        top:0;//因为是相对于shopcar做定位
        left:0;
        z-index:-1;
        width:100%;
        transform:translate3d(0,-100%,0);
        &.fold-enter-active,&.fold-leave-active{
            transition: all .5s ease;
        }
        &.fold-enter,&.fold-leave-to{
            transform:translate3d(0,0,0);
        }
        .list-header{
            display:flex;
            justify-content: space-between;
            height: 40px;
            line-height: 40px;
            background-color: #f3f5f7;
            padding:0 18px;
            border-bottom: 2px solid rgba(7,17,27,0.1);
            .title{
                font-size: 14px;
                color:rgb(7,17,27);
            }
            .empty{
                font-size:12px;
                color:rgb(0,160,220);
            }
        }
        .list-content{
            padding: 0 18px;
            max-height: 217px;
            overflow: hidden;
            background-color: #fff;
            .food{
                position:relative;
                padding:12px 0;
                box-sizing: border-box;
                border-bottom:1px solid rgba(7,17,27,0.1);
                .name{
                    line-height: 24px;
                    font-size:14px;
                    color:rgb(7,17,27); 
                }
                .price{
                    position:absolute;
                    right:90px;
                    bottom:12px;
                    line-height: 24px;
                    font-size: 14px;
                    font-weight: 700;
                    color:rgb(240,20,20);
                }
                .cartcontrol-wrapper{
                    position: absolute;
                    right:0;
                    bottom:6px;
                }
            }
        }
    }
}
.list-mask{
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:40;// z-index 要小于shopcar-container的z-index 避免直接将主体遮住
    opacity: 1;
    backdrop-filter:blur(10px);
    background-color: rgba(7,17,27,0.6);
    &.fade-enter-active,&.fade-leave-active{
        transition:all .5s;
    }
    &.fade-enter,&.fade-leave-to{
        opacity: 0;
        background-color: rbga(7,17,27,0);
    }
}
</style>