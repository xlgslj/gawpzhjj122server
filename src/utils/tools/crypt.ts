/***
 * @author chenjianxiang
 * @date 2016-07-07
 */

var crypto = require('crypto');
export const des = {
    encrypt:function(str){
        const hash = crypto.createHash('md5');
        hash.update(str);
        let v = hash.digest('hex')       
        return v;
    }
};
//消息摘要算法
export const md5 = {
    encrypt:function(str){
        const hash = crypto.createHash('md5');
        hash.update(str);
        let v = hash.digest('hex')       
        return v;
    }
};

export function getsha256 (str: string) {
    //添加签名，防篡改
    var base64Str=Buffer.from(str,"utf8").toString("base64");
    var secret="as@www.pzhsykj.cn";
    var hash=crypto.createHmac('sha256',secret);
        hash.update(base64Str);
    return hash.digest('base64');
}