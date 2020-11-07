<template>
    <div id="goods-container">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li class="menu-item" v-for="(item,i) in goodsList" :key="i" :class="{'current':currentIndex===i}" @click="selectMenu(i,$event)">              
                    <span class="text">
                        <span v-show='item.type>0' class="icon" :class="classMap[item.type]"></span>
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodsWrapper">
            <ul>
                <li class="food-list food-list-hook" v-for="(item,i) in goodsList" :key="i">
                    <h1 class="title">{{ item.name }}</h1>
                    <ul>
                        <li class="food-item" v-for="(food,index) in item.foods" :key="index" @click="selectFood(food,$event)">
                            <div class="icon">
                                <img :src="food.icon" width='57' height='57' alt="">
                            </div>
                            <div class="content">
                                <h2 class="name">{{ food.name }}</h2>
                                <p class="desc">{{ food.description }}</p>
                                <div class="extra">
                                    <span>月售{{ food.sellCount }}份</span>
                                    <span>好评率{{ food.rating }}%</span>
                                </div>
                                <div class="price">
                                    <span class="new">￥{{ food.price }}</span>
                                    <span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <cartcontrol @add="addCart" :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>           
            </ul>
        </div>
        <shopcar ref="shopcart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></shopcar>
        
        <food :food="selectedFood" @add="addCart" ref="food"></food>

    </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcar from '../subcomponents/shopcar/shopcar'
import cartcontrol from '../subcomponents/cartcontrol/cartcontrol'
import food from '../food/food'

export default {
    data(){
        return{
            goodsList:[],
            listHeight:[],
            scrollY:0,
            selectedFood:{}
        }
    },
    methods:{
        getgoodsinfo(){
            this.$http.get('/apires/api/goods').then( result => {
                // console.log(result.body.data);
                if(result.body.errno === 0){
                    this.goodsList=result.body.data;
                }
            })
        },
        _initScroll(){
            // 第一个对象是DOM对象,第二个参数是一个options对象
            this.meunScroll=new BScroll(this.$refs.menuWrapper,{
                click:true
            });
            this.foodsScroll=new BScroll(this.$refs.foodsWrapper,{
                click:true,
                probeType:3 //1.可以检测实时滚动的效果
            });
            //2.监听scroll事件,获取实时滚动的位置
            this.foodsScroll.on('scroll',(pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));
                // console.log(this.scrollY)
            });
        },
        _calculateHeight(){
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');//food-list-hook这种类名无实际效果,便于操作DOM对象
            let height = 0;
            this.listHeight.push(height);
            for(let i=0;i<foodList.length;i++){
                height+=foodList[i].clientHeight;
                this.listHeight.push(height);
            }
            // console.log(this.listHeight);
        },
        selectMenu(index,event){
            // 当页面为PC端时,点击click会触发两次,为了避免触发原生点击事件,进行下面的判断
            // 原生点击事件没有_constructed属性,所有event.constructed会为false
            if(!event._constructed){
                return
            }
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
            // scrollToElement方法可以滚动到相应的位置
            this.foodsScroll.scrollToElement(foodList[index],300);
        },
        addCart(target){
            this.$nextTick(() => {// 调用子组件shopcar的drop方法,将target传给子组件shopcar
                this.$refs.shopcart.drop(target);
            });
        },
        selectFood(food,event){//传入选中的食物,展开食物详情页
           if(!event._constructed){
                return
            } 
            this.selectedFood=food;
            this.$refs.food.show();
        }
    },
    created(){
        this.getgoodsinfo();
        this.classMap=['decrease','discount','special','invoice','guarantee'];
        // 此时created阶段拿不到DOM对象,DOM对象并没有渲染到页面中---可以调用this.$nextTick()
        // this.$nextTick(() => {
        //     this._initScroll();//得到scrollY
        //     this._calculateHeight(); //得到listHeight数组
        // })
    },
    computed:{
        currentIndex(){//比较scrollY与listHeight中的值,判断当前index
            for(let i=0;i<this.listHeight.length;i++){
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i+1];
                // 最后一个值时,height2为undefined,所有需要!height2
                if(!height2 || this.scrollY>=height1&&this.scrollY<height2){
                    return i;
                }
            }
            return 0;
        },
        selectFoods(){//返回一个加入购物车选中的数组
            let foods=[];
            this.goodsList.forEach((goods) =>{
                goods.foods.forEach((food) => {
                    if(food.count){
                        foods.push(food);
                    }
                })
            });
            return foods;
        }
    },
    watch:{
        goodsList:function(){
            // 此时created阶段拿不到DOM对象,DOM对象并没有渲染到页面中---可以调用this.$nextTick()
            this.$nextTick(() => {
                this._initScroll();//得到scrollY
                this._calculateHeight(); //得到listHeight数组
            })
        }
    },
    components:{
        shopcar,
        cartcontrol,
        food
    },
    props:['seller']
}
</script>

<style lang="scss">
#goods-container{
    display:flex;
    position:absolute;
    top:174px;
    bottom:46px;
    width:100%;
    overflow: hidden;
    .menu-wrapper{
        flex: 0 0 80px;
        width:80px;
        background-color: #f3f5f7;
        .menu-item{
            display: table;
            height:54px;
            width:56px;
            line-height: 14px;
            padding:0 12px;
            &.current{
                position: relative;
                margin-top: -1px;
                z-index:10;
                background-color: #fff;
                font-weight: 700;
                .text{
                    border-bottom:0;
                }
            }
            .icon{
                display:inline-block;
                vertical-align: top;
                width:12px;
                height:12px;
                background-size: 12px 12px;
                background-repeat: no-repeat;
                &.decrease{
                    background-image:url("decrease_3@2x.png");
                    @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                        backdround-img:url("decrease_3@3x.png");
                    }
                }
                &.discount{
                    background-image:url("discount_3@2x.png");
                    @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                        backdround-img:url("discount_3@3x.png");
                    }
                }
                &.guarantee{
                    background-image:url("guarantee_3@2x.png");
                    @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                        backdround-img:url("guarantee_3@3x.png");
                    }
                }
                &.invoice{
                    background-image:url("invoice_3@2x.png");
                    @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                        backdround-img:url("invoice_3@3x.png");
                    }
                }
                &.special{
                    background-image:url("special_3@2x.png");
                    @media (-webkit-min-device-pixel-radio:3),(min-device-pixel-radio:3){
                        backdround-img:url("special_3@3x.png");
                    }
                }
            }
            .text{
                display:table-cell;
                width:56px;
                vertical-align: middle;
                font-size:12px;
                line-height: 14px;
                border-bottom:1px solid rgba(7,17,27,0.1);
                
            }
        }
    }
    .foods-wrapper{
        flex:1;
        font-size:12px;
        .food-list{
            .title{
                font-size:12px;
                color:rgb(147,153,159);
                line-height: 26px;
                background-color: #f3f5f7;
                padding-left: 14px;
                border-left:2px solid #d9dde1;
            }
            .food-item{
                display: flex; 
                position:relative;
                margin:18px;
                padding-bottom:18px;
                border-bottom:1px solid rgba(7,17,27,0.1);
                &:last-child{
                    border-bottom:0;
                    margin-bottom:0;
                }
                .icon{
                    flex:0 0 57px;
                    margin-right:10px;
                }
                .content{
                    flex:1;
                    .name{
                        padding-top:2px;
                        font-size:14px;
                        line-height: 14px;
                        color:rgb(7,17,27);
                    }
                    .desc,.extra{
                        font-size: 10px;
                        line-height: 10px;
                        color:rgb(147,153,159);
                    }
                    .desc{
                        line-height: 12px;
                        margin:8px 0;
                    }
                    .extra{
                        span{
                            margin-right:12px;
                        }
                    }
                    .price{
                        line-height: 24px;
                        font-weight: 700;
                        .new{
                            font-size:14px;
                            margin-right: 8px;
                            color:rgb(240,20,20);
                        }
                        .old{
                            font-size: 10px;
                            text-decoration:line-through;
                            color:rgb(147,153,159);
                        }
                    }
                    .cartcontrol-wrapper{
                        position:absolute;
                        right:0;
                        bottom:12px;
                    }
                }
            }
        }
    }
}
</style>