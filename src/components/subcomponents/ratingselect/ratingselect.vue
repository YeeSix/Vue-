<template>
    <div class="ratingselect-container">
        <div class="rating-type">
            <span class="block positive" @click="select(2,$event)" :class="{'active':selectType===2}">{{ desc.all }}<span class="count">{{ ratings.length }}</span></span>
            <span class="block positive" @click="select(0,$event)" :class="{'active':selectType===0}">{{ desc.positive }}<span class="count">{{ positives.length }}</span></span>
            <span class="block negative" @click="select(1,$event)" :class="{'active':selectType===1}">{{ desc.negative }}<span class="count">{{ negatives.length}}</span></span>
        </div>
        <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
const POSITIVE = 0; 
const NEGATIVE = 1;
const ALL = 2;

export default {
    props:{
        ratings:{
            type:Array,
            default(){
                return [];
            }
        },
        selectType:{
            type:Number,
            default:ALL // 便于增加代码可读性
        },
        onlyContent:{ //是否只显示有内容的评论
            type:Boolean,
            default:true
        },
        desc:{ //三个头标题
            type:Object,
            default(){
                return {
                    all:'全部',
                    positive:'推荐',
                    negative:'吐槽'
                }
            }
        }
    },
    methods:{
        select(type, event) {// 点击响应的tag改变selectType
            if (!event._constructed) {
              return;
            }
            this.$emit('select', type);
        },
        toggleContent(event) {// 点击响应的tag改变selectType
            if (!event._constructed) {
                return;
            }
            this.$emit('toggle');
        }
    },
    computed:{
        positives(){
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE;
            })
        },
        negatives(){
            return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE;
            })
        }
    }
}
</script>

<style lang="scss">
.ratingselect-container{
    font-size:12px;
    .rating-type{
        padding:18px 0;
        margin:0 18px;
        font-size: 0;
        border-bottom:1px solid rgba(7,17,27,0.1);
        .block{
            display: inline-block;
            padding:8px 12px;
            margin-right: 8px;
            border-radius: 2px;
            color:rgb(77,85,93);
            font-size: 12px;
            line-height: 16px;
            &.active{
                color:#fff;
            }
            .count{
                font-size: 8px;
                margin-left: 2px;
            }
            &.positive{
                background-color: rgba(0,160,220,0.2);
                &.active{
                    background-color: rgb(0,160,220);
                }
            }
            &.negative{
                background-color: rgba(77,85,93,0.2);
                &.active{
                    background-color: rgb(77,85,93);
                }
            }
        }
    }
    .switch{
        padding: 12px 18px;
        line-height: 24px;
        border-bottom:1px solid rgba(7,17,27,0.1);
        color:rgb(147,153,159);
        font-size: 0;
        &.on{
            .icon-check_circle{
                color: #00c850;
            }
        }
        .icon-check_circle{
            display: inline-block;
            vertical-align: middle;
            font-size: 24px;
            margin-right: 4px;
        }
        .text{
            display: inline-block;
            vertical-align: middle;
            font-size:12px;
        }
    }
}
</style>