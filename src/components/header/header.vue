<template>
    <div id="header-container">
        <!-- 内容 -->
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" width="64" height="64" alt="">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"><img src="" alt=""></span>
                    <span class="name">{{ seller.name }}</span>
                </div>
                <div class="description">
                    {{ seller.description }} / {{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{ seller.supports[0].description }}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="showDetail">
                <span class="count">{{ seller.supports.length }}个</span>
                <i class="icon-keyboard_arrow_right"></i>
            </div>
        </div>
        <!-- 公告 -->
        <div class="bulletin-wrapper" @click="showDetail">
            <div class="bulletin-icon"></div>
            <div class="bulletin-text">{{seller.bulletin}}</div>
            <i class="icon-keyboard_arrow_right"></i>
        </div>
        <!-- 背景图 -->
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%" alt="">
        </div>
        <!-- 详情页 -->
        <transition name="fade">
            <div class="detail" v-show="detailShow">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <star size="48" :score="seller.score"></star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports" >
                            <li class="support-item" v-for="(item,i) in seller.supports" :key="i">
                                <span class="icon" :class='classMap[seller.supports[i].type]'></span>
                                <span class="text">{{seller.supports[i].description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">{{ seller.bulletin }}</div>
                    </div>
                </div>
                <div class="detail-close">
                    <i class="icon-close" @click="hiddenDetail"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import star from '../subcomponents/star/star'
export default { 
    data(){
      return{
        detailShow:false
      }  
    },
    created(){
        this.classMap=['decrease','discount','special','invoice','guarantee']
    },
    methods:{
        showDetail(){
            this.detailShow = true;
        },
        hiddenDetail(){
            this.detailShow = false;
        }
    },
    components:{
        star
    },
    props:['seller']
}
</script>

<style lang="scss">
@import '../../common/scss/base.scss';
@import '../../common/scss/style.css';

#header-container{
    color:#fff;
    position:relative;
    background-color: rgba(7,17,27,0.5);
    overflow: hidden;
    .content-wrapper{
        display:flex;
        padding:24px 12px 18px 24px;
        position: relative;
        .avatar{
            margin-right:16px;
            img{
                border-radius:2px;
            }
        }
        .content{
            .title{
                margin:2px 0 8px 0;
                display:flex;
                .name{
                    font-size:16px;
                    font-weight:bold;
                    line-height:18px;
                }
                .brand{
                    margin-right:6px;
                    width:30px;
                    height:18px;
                    background-image:url("brand@2x.png");
                    @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                        backdround-img:url("brand@3x.png");
                    }
                    background-size:30px 18px;
                    background-repeat: no-repeat;
                }
            }
            .description{
                font-size:12px;
                line-height: 12px;
                margin-bottom:10px;
            }
            .support{
                display:flex;
                .icon{
                    width:12px;
                    height:12px;
                    margin-right: 4px;
                    margin-bottom: 2px;
                    background-size: 12px 12px;
                    background-repeat: no-repeat;
                    &.decrease{
                        background-image:url("decrease_1@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("decrease_1@3x.png");
                        }
                    }
                    &.discount{
                        background-image:url("discount_1@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("discount_1@3x.png");
                        }
                    }
                    &.guarantee{
                        background-image:url("guarantee_1@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("guarantee_1@3x.png");
                        }
                    }
                    &.invoice{
                        background-image:url("invoice_1@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("invoice_1@3x.png");
                        }
                    }
                    &.special{
                        background-image:url("special_1@2x.png");
                        @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                            backdround-img:url("special_1@3x.png");
                        }
                    }
                }
                .text{
                    font-size:10px;
                    line-height:12px;
                }
            }
        }
        .support-count{
            position:absolute;
            bottom:14px;
            right: 12px;
            padding:0 8px;
            display:flex;
            height:24px;
            line-height:24px;
            background-color: rgba(0,0,0,0.2);
            border-radius:14px;
            text-align: center;
            .count{
                font-size:10px;
            }
            .icon-keyboard_arrow_right{
                line-height: 24px;
                font-size:10px;
                margin-left:2px;
            }
        }
    }
    .bulletin-wrapper{
        display:flex;
        background-color: rgba(7,17,27,0.2);
        height:28px;
        line-height: 28px;
        padding:0 12px 0 12px;
        .bulletin-icon{
            width:100px;
            height:12px;
            margin:8px 4px 0 0;
            background-image:url("bulletin@2x.png");
            @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    backdround-img:url("bulletin@3x.png");
            }
            background-size: 22px 12px;
            background-repeat: no-repeat;
        }
        .bulletin-text{
            display: inline-block;
            font-size:10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .icon-keyboard_arrow_right{
            line-height: 28px;
            font-size:10px;
            margin-left:4px;
        }
    }
    .background{
        position:absolute;
        top:15%;
        left:10%;
        z-index:-1;
        width:80%;
        height:80%;
        filter:blur(10px);
    }
    .detail{
        position:fixed;
        z-index:100;
        top:0;
        left:0;
        width:100%;
        height:100%;
        overflow:auto;
        background-color:rgba(7,17,27,0.8);
        backdrop-filter:blur(10px);
        &.fade-enter-active, &.fade-leave-active {
            transition: all .5s;
        }
        &.fade-enter, &.fade-leave-to{
            opacity: 0;
        }
        .detail-wrapper{
            // sticky footer设计,
            // 即首先让第一个盒子detail-wrapper占据100%页面,
            // 再让第二个盒子detail-close相对定位,margin-top为负值,上移定位到第一个盒子的下方
            // 再将第一个盒子下方留出一定位置margin-bottom,便于内容不会和第二个盒子重合
            min-height:100%;
            width:100%;
            .detail-main{
                margin-top:64px;
                padding-bottom:64px;
                .name{
                    font-size:16px;
                    font-weight: 700;
                    text-align: center;
                }
                .star-wrapper{
                    margin-top:16px;
                    padding:2px 0;
                    text-align:center;
                }
                .title{
                    display:flex;
                    width:80%;
                    margin:28px auto 24px auto;
                    .line{
                        flex:1;
                        position: relative;
                        top:-6px;
                        border-bottom:1px solid rgba(255,255,255,0.2)
                    }
                    .text{ 
                        font-size:14px;
                        font-weight:700;
                        margin:0 12px; 
                    }
                }
                .supports{
                    width:80%;
                    margin:0 auto;
                    .support-item{
                        padding:0 12px;
                        display:flex;
                        margin-bottom:12px;
                        font-size:0;
                        &.lastchild{
                            margin-bottom:0;
                        }
                        .icon{
                            width:16px;
                            height:16px;
                            margin-right:6px;
                            background-size: 16px 16px;
                            background-repeat: no-repeat;
                            &.decrease{
                                background-image:url("decrease_1@2x.png");
                                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                                    backdround-img:url("decrease_1@3x.png");
                                }
                            }
                            &.discount{
                                background-image:url("discount_1@2x.png");
                                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                                    backdround-img:url("discount_1@3x.png");
                                }
                            }
                            &.guarantee{
                                background-image:url("guarantee_1@2x.png");
                                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                                    backdround-img:url("guarantee_1@3x.png");
                                }
                            }
                            &.invoice{
                                background-image:url("invoice_1@2x.png");
                                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                                    backdround-img:url("invoice_1@3x.png");
                                }
                            }
                            &.special{
                                background-image:url("special_1@2x.png");
                                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                                    backdround-img:url("special_1@3x.png");
                                }
                            }
                        }
                        .text{
                            line-height: 16px;
                            font-size:12px;
                        }
                    }
                }
                .bulletin{
                    width:80%;
                    margin:0 auto;
                    padding:0 12px;
                    font-size:12px;
                    line-height: 24px;
                }
            }
        }
        .detail-close{
            position:relative;
            width:32px;
            height:32px;
            margin:-64px auto;
            clear:both;
            .icon-close{
                font-size:32px;
            }
        }
    }
}
</style>
