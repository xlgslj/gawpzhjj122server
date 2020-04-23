export default function getType(obj){
    let type  = typeof obj;
    if(type != "object"){
      return type;
    }
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
  }

  /*
  //判断是否为数组：
exports.isArray= function (o) { 
    return Object.prototype.toString.call(o) === '[object Array]';  
}

//判断是否为NULL
exports.isNull = function (o) { 
    return Object.prototype.toString.call(o) === '[object Null]';  
}

//判断是否为Number
exports.isNumber = function (o) { 
    return Object.prototype.toString.call(o) === '[object Number]';  
}

//判断是否为Number
exports.isDate = function (o) { 
    return Object.prototype.toString.call(o) === '[object Date]';  
}

//判断是否为Number
exports.isString = function (o) { 
    return Object.prototype.toString.call(o) === '[object String]';  
}
*/