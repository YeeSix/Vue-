/**
 * 解析URL参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse(){
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg); //['?id=12345','&a=b']
    if(arr){
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');//substring(1)截去第一个字母 //split('=')以等号为分界分割成数组
            let key = decodeURIComponent(tempArr[0]);
            let val = decodeURIComponent(tempArr[1]);
            obj[key]=val;
        })
    }
    return obj;
};