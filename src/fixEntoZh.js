const Store = {
    // 第一优先级
    '“': '"',
    "‘": "'",
    "：": ": ",
    "/ ": "/",
    "ℴ": "-"

}

// 二分法 获取 
/**
 * @description 
 * @param {String} str 
 * @returns {String}
 */
const halfStr = (str) =>{
    if (str.length <= 1 ) {
        if(reg.test(str) || reg2(str)){
            return charZh2En(str)
        }
        return str
    }

    let qian = str.substring(0, str.length/2)
    let hou = str.substring(str.length/2, str.length)

    return halfStr(qian) + halfStr(hou)
}

// 验证 1
const reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;

// 验证 2
const reg2 = (str) => {
    for(i in str){
        if( "～｀！＠＃＄＾％＆＊（）＿＋｜－＝｛｝［］：＂；＜＞？，．／＼＇".indexOf(str[i])>=0 ){
            return true
        }
    }
    return false
} 

const numStore = [8220, 8216]

// , 34, 39
// 执行 转化操作
function charZh2En(str) {
    var tmp = '';
    for (var i = 0; i < str.length; i++) {
        if( Object.keys(Store).some(x =>x==str[i])){
            // 第一优先级
            tmp += Store[str[i]]
        }else{
            // 第二优先级
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
        }
    }
    return tmp
}

// 主 函数
/**
 * @description 
 * @param {Array|String} data 
 * @returns {Array|String}
 */
const fixEntoZh = function fixEntoZh(data){

    if(!(data instanceof Array)){
        data = data.trim()
        return halfStr(data)
    }else{
        
        data = data.map(x =>{
            return halfStr(x)
        })

        return data
    }

}

module.exports = {fixEntoZh, charZh2En ,reg, Store, halfStr, reg2 }

