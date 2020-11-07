<template>
    <div id="ratings-container" ref='ratings'>
        <div class="ratings-content">
            <div class="overview">
                <div class="left">
                    <div class="score">{{ seller.score}}</div>
                    <h2 class="title">综合评价</h2>
                    <p class="text">高于周边商家{{ seller.rankRate}}%</p>
                </div>
                <div class="right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star class="star" :size='36' :score="seller.serviceScore"></star>
                        <span class="score">{{ seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <star class="star" :size='36' :score="seller.foodScore"></star>
                        <span class="score">{{ seller.foodScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">送达时间</span>
                        <span class="text">{{ seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingselect @select="selectRating" @toggle="toggleContent" :ratings='ratings' :onlyContent="onlyContent" :selectType="selectType" :desc="desc"></ratingselect>
            <ul class="rating-wrapper">
                <li class="rating-item" v-for="(rating,i) in ratings" :key="i" v-show="needShow(rating.rateType,rating.text)">
                    <div class="avatar">
                        <img :src="rating.avatar" width="28" height="28">
                    </div>
                    <div class="content">
                        <div class="top">
                            <h2 class="name">{{ rating.username }}</h2>
                            <div class="time">{{ rating.rateTime | formatDate }}</div>
                        </div>
                        <div class="middle">
                            <star class="star" :score="rating.score" :size="24"></star>
                            <span class="delivery" v-show="rating.deliveryTime">{{ rating.deliveryTime }}分钟送达</span>
                        </div>
                        <div class="text">{{ rating.text }}</div>
                        <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                            <i :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></i>
                            <span class="item" v-for="(item,i) in rating.recommend" :key="i" v-show="i < 3 ? true: false">{{ item }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import star from '../subcomponents/star/star'
import split from '../subcomponents/split/split'
import { formatDate } from '../../common/js/date'
import ratingselect from '../subcomponents/ratingselect/ratingselect'
import BScroll from 'better-scroll'
const POSITIVE = 0; 
const NEGATIVE = 1;
const ALL = 2;

export default {
    data(){
        return{
            ratings:[],
            onlyContent:false,
            selectType:ALL,
            desc:{
                all:'全部',
                positive:'满意',
                negative:'不满意'
            }
        }
    },
    created(){
        this.getratingsinfo();
    },
    methods:{
        getratingsinfo(){
            this.$http.get('/apires/api/ratings').then((result) => {
                console.log(result.body.data);
                this.ratings = result.body.data;
            })
        },
        _initScroll(){
            if(!this.scroll){
                this.scroll = new BScroll(this.$refs.ratings,{
                    click:true
                });
            }else{
                this.scroll.refresh();
            }
        },
        needShow(type,text){
            // 只看内容且内容为空时 不显示
            if(this.onlyContent && !text){
                return false;
            }
            if(this.selectType === ALL){// 当选中 全部 时 显示所有
                return true;
            }else{// 选中其他的时 判断同类型评论
                return type === this.selectType;
            }
        },
        selectRating(type){
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        toggleContent(){
            this.onlyContent = !this.onlyContent;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        }
    },
    components:{
        star,
        split,
        ratingselect
    },
    watch:{
        ratings(){
            this.$nextTick(() => {
                this._initScroll();
            })
        }
    },
    mounted(){
        this.$nextTick(() => {
            this._initScroll();
        })
    },
    filters:{
        formatDate(time){
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm');
        }
    },
    props:['seller']
}
</script>

<style lang="scss">
#ratings-container{
    position:absolute;
    top:174px;
    left:0;
    bottom:0;
    width:100%;
    overflow: hidden;
    .overview{
        padding:18px 0;
        display: flex;
        .left{
            width:275px;
            text-align: center;
            border-right:1px solid rgba(7,17,27,0.1);
            .score{
                margin-bottom:6px;
                font-size: 24px;
                line-height: 28px;
                color:rgb(255,153,0);
            }
            .title{
                margin-bottom:8px;
                font-size: 12px;
                line-height: 12px;
                color:rgb(7,17,27);
            }
            .text{
                margin-bottom:6px;
                font-size: 10px;
                line-height: 10px;
                color:rgb(7,17,27);
            }
        }
        .right{
            width:474px;
            padding: 0 24px;
            .score-wrapper{
                display: flex;
                margin-bottom:8px;
                &:last-child{
                    margin:0;
                }
                .title{
                    padding-right:12px;
                    font-size: 12px;
                    line-height: 18px;
                    color:rgb(7,17,27);
                }
                .star{
                    padding-right: 6px;
                    line-height: 18px;
                }
                .score{
                    color:rgb(255,153,0);
                    font-size: 12px;
                    line-height: 18px;
                }
                .text{
                    font-size:12px;
                    line-height: 18px;
                    color:rgb(147,153,159);
                }
            }
        }
    }
    .rating-wrapper{
        padding: 0 18px;
        .rating-item{
            display: flex;
            padding:18px 0;
            border-bottom:1px solid rgba(7,17,27,0.1);
            .avatar{
                margin-right:12px;
                img{
                    border-radius: 50%;
                }
            }
            .content{
                width:100%;
                .top{
                    display: flex;
                    justify-content:space-between;
                    padding-bottom:4px;
                    .name{
                        font-size: 10px;
                        line-height: 12px;
                        color:rgb(7,17,27);
                    }
                    .time{
                        font-size: 10px;
                        line-height: 12px;
                        color:rgb(147,153,159);
                    }
                }
                .middle{
                    padding-bottom:6px;
                    display:flex;
                    .delivery{
                        padding-left:3px;
                        font-size:10px;
                        line-height: 12px;
                        color:rgb(147,153,159);
                    }
                }
                .text{
                    margin-bottom:8px;
                    line-height: 18px;
                    font-size: 12px;
                    color:rgb(7,17,27);
                }
                .recommend{
                    font-size: 0;
                    .icon-thumb_up,.icon-thumb_down{
                        margin-right:8px;
                        line-height: 16px;
                        font-size: 12px;
                    }
                    .icon-thumb_up{
                        color:rgb(0,160,220);
                    }
                    .icon-thumb_down{
                        color:rgb(183,187,191);
                    }
                    .item{
                        display: inline-block;
                        padding: 0 6px;
                        margin-right:8px;
                        border:1px solid rgba(7,17,27,0.1);
                        border-radius: 2px;
                        line-height: 16px;
                        font-size: 9px;
                        color:rgb(147,153,159);
                    }
                }
            }
        }
    }
}
</style>