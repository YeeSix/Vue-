/**
 * @param {*} id 要录入信息的店铺id
 * @param {*} key 要录入的key
 * @param {*} value 要录入key的value值 
 */
export function saveToLocal(id,key,value){
    let seller = window.localStorage.__seller__;
    if(!seller){// 1.判断是否存在__seller__数据文件
        seller = {};// 1.1 不存在 就创建一个空文件 再创建一个对应id的空对象
        seller[id]={};
    }else{// 1.2 存在 就将数据文件取出(即将数据文件由字符串格式转为对象)
        seller = JSON.parse(seller);
        if(!seller[id]){ // 判断是否存在对应id的对象 不存在则创建一个空对象
            seller[id]={};
        }
    }
    // 将对应id商铺的对应属性key赋值
    seller[id][key]=value;
    // 最后将数据转为字符串 存入localStorage中
    window.localStorage.__seller__ = JSON.stringify(seller);
};

/**
 * @param {*} id 要读取的店铺id
 * @param {*} key 要读取的key
 * @param {*} def 如果没读取到 默认是什么
 */
export function loadFromLocal(id,key,def){
    let seller = window.localStorage.__seller__;
    if(!seller){// 没有数据文件__seller__ 就返回默认数据
        return def;
    }
    seller = JSON.parse(seller)[id]; // 先将字符串转为对象之后 取得商铺id属性
    if(!seller){ // 若没有id商铺 就返回默认值
        return def;
    }

    // 直接返回id商铺的key属性 若没有key属性则返回默认值
    return seller[key] || def;
};