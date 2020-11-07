export function formatDate(date,fmt){
    // 对年份单独格式化
    if(/(y+)/.test(fmt)){//RegExp.$1指的是匹配到的第一个字符串
        fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length));
    }

    // 对除去年份之外的两位数字的进行格式化
    let o={
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for(let k in o){
        if(new RegExp(`(${k})`).test(fmt)){
            let str = o[k] + '';//加上'' 使其变成字符串
            fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1) ? str : padLeftZero(str));
        }
    }
    return fmt
}

function padLeftZero(str){
    return ('00'+str).substr(str.length);
}