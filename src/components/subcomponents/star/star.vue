<template>
    <div id="star" :class="starType">
        <span class="star-item" v-for="(itemClass,i) in itemClasses" :key="i" :class="itemClass"></span>
    </div>
</template>

<script>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {
    props:['size','score'],
    computed:{
        starType(){
            return 'star-' + this.size;
        },
        itemClasses(){
            let result =[];
            // 判断:四舍五入 on--1 half--0.5 off--0
            let Score = Math.floor(this.score*2)/2;
            let hasDecimal = (Score % 1 !== 0);
            let integer = Math.floor(Score);
            for(let i=0; i<integer; i++){
                result.push(CLS_ON);
            }
            if(hasDecimal){
                result.push(CLS_HALF);
            }
            while(result.length<LENGTH){
                result.push(CLS_OFF);
            }
            return result;
        }
    }
}
</script>

<style lang="scss">
#star{
    font-size:0;
    .star-item{
        display:inline-block;
        background-repeat: no-repeat;
    }
    &.star-48{
        .star-item{
            width:20px;
            height:20px;
            margin-right:22px;
            background-size: 20px 20px;
            &.last-child{
                margin-right:0;
            }
            &.on{
                background-image: url('star48_on@2x.png');
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    background-image: url('star48_on@3x.png');
                }
            }
            &.half{
                background-image:url("star48_half@2x.png");
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    backdround-img:url("star48_half@3x.png");
                }
            }
            &.off{
                background-image:url("star48_off@2x.png");
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    backdround-img:url("star48_off@3x.png");
                }
            }
        }
    }
    &.star-36{
        .star-item{
            width:15px;
            height:15px;
            margin-right:6px;
            background-size: 15px 15px;
            &.last-child{
                margin-right:0;
            }
            &.on{
                background-image: url('star36_on@2x.png');
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    background-image: url('star36_on@3x.png');
                }
            }
            &.half{
                background-image:url("star36_half@2x.png");
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    backdround-img:url("star36_half@3x.png");
                }
            }
            &.off{
                background-image:url("star36_off@2x.png");
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    backdround-img:url("star36_off@3x.png");
                }
            }
        }
    }
    &.star-24{
        .star-item{
            width:10px;
            height:10px;
            margin-right:3px;
            background-size: 10px 10px;
            &.last-child{
                margin-right:0;
            }
            &.on{
                background-image: url('star24_on@2x.png');
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    background-image: url('star24_on@3x.png');
                }
            }
            &.half{
                background-image:url("star24_half@2x.png");
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    backdround-img:url("star24_half@3x.png");
                }
            }
            &.off{
                background-image:url("star24_off@2x.png");
                @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                    backdround-img:url("star24_off@3x.png");
                }
            }
        }
    }
}
</style>