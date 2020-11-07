<template>
    <div id="seller-container" ref="seller">
        <div class="seller-content">
            <div class="overview">
                <h2 class="title">{{ seller.name }}</h2>
                <div class="desc">
                    <star class="star" :size="36" :score="seller.score"></star>
                    <span class="text">({{ seller.ratingCount }})</span>
                    <span class="text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>配送价</h2>
                        <div class="content">
                            <span class="stress">{{ seller.minPrice }}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{ seller.deliveryPrice }}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{ seller.deliveryTime }}</span>元
                        </div>
                    </li>                    
                </ul>
                <div class="favorite">
                    <span class="icon-favorite" :class="{'active':favorite}" @click="toggleFavor"></span>
                    <span class="text">{{ favoriteText }}</span>
                </div>
            </div>
            <split></split>
            <div class="bulletin">
                <div class="title">公告与活动</div>
                <div class="content-wrapper">
                    <p class="content">{{ seller.bulletin }}</p>
                </div>
                <ul v-if="seller.supports" class="supports" >
                    <li class="support-item" v-for="(item,i) in seller.supports" :key="i">
                        <span class="icon" :class='classMap[seller.supports[i].type]'></span>
                        <span class="text">{{seller.supports[i].description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pics">
                <h2 class="title">商家实景</h2>
                <div class="pic-wrapper" ref="picWrapper">
                    <ul class="pic-list" ref="picture">
                        <li class="pic-item" v-for='pic in seller.pics' :key="pic">
                            <img :src="pic" alt="">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="info">
                <h2 class="title">商家信息</h2>
                <ul>
                    <li class="info-item" v-for="info in seller.infos" :key=info>{{ info }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {saveToLocal,loadFromLocal}  from '../../common/js/store'
import star from '../subcomponents/star/star'
import split from '../subcomponents/split/split'
import BScroll from 'better-scroll'

export default {
    data(){
      return{
          favorite:(() => {
              return loadFromLocal(this.seller.id,'favorite',false);
          })()//立即调用函数
      } 
    },
    created(){
        this.classMap=['decrease','discount','special','invoice','guarantee']
    },
    methods:{
        _initScroll(){
            if(!this.scroll){
                this.scroll = new BScroll(this.$refs.seller,{
                    click:true
                });
            }else{
                this.scroll.refresh();
            }
        },
        _initPics(){
            if(this.seller.pics){
                let picWidth = 120;
                let margin = 6;
                let width = (picWidth + margin)*this.seller.pics.length - margin;
                this.$refs.picture.style.width= width +'px';
                this.$nextTick(() => {
                    if(!this.picScroll){
                        this.picScroll = new BScroll(this.$refs.picWrapper,{
                            scrollX:true,
                            eventPassthrough:'vertical' // 使内部横向滚动 外部纵向滚动
                        })
                    }else{
                        this.picScroll.refresh();
                    }
                })  
            }
        },
        toggleFavor(event){
            if(!event._constructed){
                return;
            }
            this.favorite = !this.favorite;
            saveToLocal(this.seller.id,'favorite',this.favorite);
        }
    },
    watch:{
        // 第一次进入商家模块时检测到seller变化 初始化this.scroll和this.picScroll
        seller(){
            this.$nextTick(() => {
                this._initScroll();
                this._initPics();
            })
        }
    },
    mounted(){
        // 在商品/评论/商家模块之间切换时 又重新执行一次生命周期 使this.scroll/picScroll.refresh();
        this._initScroll();
        this._initPics();
    },
    computed:{
        favoriteText(){
            return this.favorite ? '已收藏':'收藏';
        }
    },
    components:{
        star,
        split
    },
    props:['seller']
}
</script>

<style lang="scss">
#seller-container{
    position:absolute;
    top:174px;
    left:0;
    bottom:0;
    width:100%;
    overflow: hidden;
    .overview{
        position:relative;
        padding:18px;
        .title{
            margin-bottom:8px;
            font-size:14px;
            line-height: 14px;
            color:rgb(7,17,27);
        }
        .desc{
            padding-bottom:18px;
            border-bottom:1px solid rgba(7,17,27,0.1);
            font-size:0;
            .star{
                display: inline-block;
                vertical-align: top;
                margin-right:2px;
            }
            .text{
                margin-right:12px;
                display: inline-block;
                vertical-align: top;
                font-size:10px;
                line-height: 18px;
                color: rgb(77,85,93);
            }   
        }
        .remark{
            display:flex;
            padding:18px 0;
            font-size:10px;
            .block{
                flex:1;
                text-align: center;
                border-right:1px solid rgba(7,17,27,0.1);
                &:last-child{
                    border-right:none;
                }
                h2{
                    margin-bottom:4px;
                    color:rgb(157,153,159);
                    line-height: 10px;
                }
                .stress{
                    line-height: 24px;
                    font-size: 24px;
                    color:rgb(7,17,27);
                }
            }
        }
        .favorite{
            position:absolute;
            right:11px; // 2.因为要设置width：50px 则需要重新计算right值 使图标区块(即算上图标下的文字)实际右边距为18px
            top:18px;
            width:50px; // 1.防止点击变换时 图标左右移动
            text-align: center;
            .icon-favorite{
                display: block;
                margin-bottom:4px;
                font-size:24px;
                line-height: 24px;
                color:#d4d6d9;
                &.active{
                    color:rgb(240,20,20);
                }
            }
            .text{
                font-size:10px;
                line-height: 10px;
                color:rgb(77,85,93);
            }
        }
    }
    .bulletin{
        padding:18px 18px 0 18px;
        .title{
            margin-bottom:8px;
            font-size:14px;
            line-height: 14px;
            color:rgb(7,17,27);
        }
        .content-wrapper{
            padding:0 12px 16px;
            border-bottom:1px solid rgba(7,17,27,0.1);
            .content{
                line-height: 24px;
                font-size: 12px;
                color:rgb(240,20,20);
            }
        }
        .supports{
            .support-item{
                padding:16px 12px;
                border-bottom:1px solid rgba(7,17,27,0.1);
                font-size:0;
                &:last-child{
                    border-bottom:none;
                }
                .icon{
                    display: inline-block;
                    vertical-align: top;
                    width:16px;
                    height:16px;
                    margin-right:6px;
                    background-size: 16px 16px;
                    background-repeat: no-repeat;
                    &.decrease{
                        background-image:url("decrease_4@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("decrease_4@3x.png");
                        }
                    }
                    &.discount{
                        background-image:url("discount_4@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("discount_4@3x.png");
                        }
                    }
                    &.guarantee{
                        background-image:url("guarantee_4@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("guarantee_4@3x.png");
                        }
                    }
                    &.invoice{
                        background-image:url("invoice_4@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("invoice_4@3x.png");
                        }
                    }
                    &.special{
                        background-image:url("special_4@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("special_4@3x.png");
                        }
                    }
                }
                .text{
                    line-height: 16px;
                    font-size:12px;
                }
            }
        }
    }
    .pics{
        padding:18px;
        .title{
            margin-bottom:12px;
            font-size:14px;
            line-height: 14px;
            color:rgb(7,17,27);
        }
        .pic-wrapper{
            width:100%;
            white-space:nowrap;
            overflow: hidden;
            .pic-list{
                display: flex;
                font-size:0;
                .pic-item{
                    margin-right: 6px;
                    img{
                        width:120px;
                        height:90px;
                    }
                    &:last-child{
                        margin:0;
                    }
                }
            }
        }
    }
    .info{
        padding:18px 18px 0;
        color:rgb(7,17,27);
        .title{
            padding-bottom:12px;
            font-size:14px;
            line-height: 14px;
            border-bottom:1px solid rgba(7,17,27,0.1);
        }
        .info-item{
            padding:16px 12px;
            font-size: 12px;
            line-height: 16px;
            border-bottom:1px solid rgba(7,17,27,0.1);
            &:last-child{
                border-bottom:none;
            }
        }
    }
}
</style>