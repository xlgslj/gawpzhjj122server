
import getType from '../utils/tools/mytypeof'
let keyParser = (src, k)=>{
    let key = src[k]!==undefined ? k : (src[k.toUpperCase()]!==undefined ? k.toUpperCase(): (src[k.toLowerCase()]!==undefined? k.toLowerCase() : '' ))
    return key
}
let toString = (src, k) => {
    let key = keyParser(src, k)
    if (key) {
        let type = getType(src[key])
        switch (type) {
            case 'Array': 
                let v = src[key].length ?  `["${src[key].join('","')}"]`  : "[]"
                src[key] = v               
                break;
            default: 
            src[key] = `${src[key]}`
        }
    }  
}
let getlocaltime = function (str) {
    let tl = str.split(" ").length
    // 目标时区，东9区
    let targetTimezone = -0
    // 当前时区与中时区时差，以min为维度
    let _dif = new Date().getTimezoneOffset()
    // 本地时区时间 + 时差  = 中时区时间
    // 目标时区时间 + 时差 = 中时区时间
    // 目标时区时间 = 本地时区时间 + 本地时区时差 - 目标时区时差
    // 东9区时间
    let east8time
    if (tl === 1) east8time = new Date(str).getTime() + _dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000)
    else east8time = new Date(str) //如果是2019-01-02 08:01:22,这种输入字符就不用时区转
    return new Date(east8time)
}
let todate = (src, k) => {
    let key = keyParser(src, k)
    if (key) {
        try {
            src[key] = getlocaltime(src[key]) //new Date(src[key])
        } catch {

        }
    }  
}

//2020-03-27T01:38:37.000Z
let toDatestr = (src, k) => {
    let key = keyParser(src, k)
    if (key) {
        try {
            src[key] =src[key].Format('yyyy-MM-dd HH:mm:ss')
        } catch (e) {
            console.log(e)
        }
    }  
}



 function dataParser (src, tar){
    for (let k in tar) {
        switch(tar[k]) {
            case 'string' || 'STRING': 
                toString(src, k);
                break;
            case 'date' || 'DATE' :
                todate(src, k);
                break;
            case 'datestr' || 'DATESTR': 
                toDatestr(src, k);
                break;                
            default:
                break;
        }
    }
    //return src
}

function keytoUpperCase (src){
    for (let k in src) {
        let key = k.toUpperCase()
        if (key !== k) {
            src[key] = src[k]
            delete src[k]
        }
    }
}


export function run () {
    Object.defineProperty(Object.prototype, "dataParser", {
        enumerable: false,//描述属性是否会出现在for in 或者 Object.keys()的遍历中
        writable: true,
        configurable: true,
        value: function(fmt){
            dataParser(this, fmt)
        }
    })

    Object.defineProperty(Object.prototype, "keytoUpperCase", {
        enumerable: false,//描述属性是否会出现在for in 或者 Object.keys()的遍历中
        writable: true,
        configurable: true,
        value: function(){
            keytoUpperCase(this)
        }
    })

}