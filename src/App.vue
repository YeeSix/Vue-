<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <router-link class="tab-item" to="/goods">商品</router-link>
      <router-link class="tab-item" to="/ratings">评论</router-link>
      <router-link class="tab-item" to="/seller">商家</router-link>
    </div>
    <!-- 不会重复请求 组件被缓存 可以快速被加载 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header'
import { urlParse } from './common/js/util.js'
export default {
  data(){
    return{
        seller:{
          id:(() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()//立即执行函数拿到id
        }
    } 
  },
  created(){
      this.getsellerinfo();
  },
  methods:{
    getsellerinfo(){
      this.$http.get('/apires/api/seller').then(result => {
          // console.log(result.body);
          // this.seller = result.body.data;//这样直接赋值 会将id属性覆盖
          this.seller = Object.assign({},this.seller,result.body.data);// ES6语法
          // console.log(this.seller.id);
      })
    }
  },
  components: { 
    'v-header': header
  }
}
</script>

<style lang='scss'>
.border-1px{
  position:relative;
  &::after{
    content:'';
    position:absolute;
    left:0px;
    bottom:0px;
    width:100%;
    border-bottom:1px solid rgba(7,17,27,0.1);
  }
}
@media (-webkit-min-device-pixel-ratio:1.5),(min-device-pixel-ratio:1.5){
  .border-1px{
    &::after{
      -webkit-transform:scaleY(0.7);
      transform:scaleY(0.7);
    } 
  }
}
@media (-webkit-min-device-pixel-ratio:2),(min-device-pixel-ratio:2){
  .border-1px{
    &::after{
      -webkit-transform:scaleY(0.5);
      transform:scaleY(0.5);
    }
  }
}
#app{
  .tab{
    display: flex;
    width:100%;
    height:40px;
    line-height:40px; 

    .tab-item{
      flex:1;
      text-align:center;
      font-size:14px;
      color:rgb(77,85,93);
    }
    .router-link-active{
      color:rgb(240,20,20);
    }
  }
}
</style>
