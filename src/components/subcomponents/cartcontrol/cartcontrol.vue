<template>
    <div id="cartcontrol-contain">
        <transition name='move'>
            <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
                <span class="inner icon-remove_circle_outline"></span>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    props:['food'],
    methods:{
        addCart(event){
            // 控制在PC端不会触发两次点击事件
            if(!event._constructed){
                return;
            };

            if(!this.food.count){
                Vue.set(this.food,'count',1);
            }else{
                this.food.count++;
            }
            // 给goods组件传递一个cart.add的事件event,在事件中将点击 '＋' 的位置target传过去
            // this.$root.$emit('cart.add',event.target);
            this.$emit('add',event.target);
        },
        decreaseCart(event){
            if(!event._constructed){
                return
            }
            if(this.food.count){
                this.food.count--;
            }
        }
    }
}
</script>

<style lang="scss">
#cartcontrol-contain{
    font-size: 0;
    .cart-decrease{
        display:inline-block;
        padding:6px;
        transition: all 0.4s linear;
        .inner{
            display: inline-block;
            line-height: 24px;
            font-size:24px;
            color:rgb(0,160,220);
            transition: all 0.5s linear;
        }
        // 只需写进入时的状态和离开完成后的状态
         &.move-enter, &.move-leave-active{
            opacity: 0;
            transform: translate3d(24px, 0, 0);
            .inner{
                transform: rotate(180deg);
            }
        }    
        // &.move-enter-active,&.move-leava-active{
        //     transform:translate3d(0,0,0);
        //     .inner{
        //         transform: rotate(180deg);
        //     }
        // }
        // &.move-enter,&.move-leave-to{
        //     opacity: 0;
        //     transform:translate3d(24px,0,0);
        //     .inner{
        //         transform: rotate(0);
        //     }
        // }
              
    }
    .cart-count{
        display:inline-block;
        vertical-align:top;
        width:12px;
        padding-top:6px;
        text-align: center;
        line-height: 24px;
        font-size:10px;
        color:rgb(147,153,159);
    }
    .cart-add{
        display:inline-block;
        line-height: 24px;
        font-size:24px;
        padding:6px;
        color:rgb(0,160,220);
    }
}   
</style>