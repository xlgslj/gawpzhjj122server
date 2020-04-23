/*function logClz(params:string) {
    console.log('params:', params);  //params: hello
    return function(target:any) {
        console.log('target:', target);  //target: class HttpClient
        target.prototype.url = params;  //扩展一个url属性
    }
}
@logClz('hello')
class HttpClient {
    constructor() { }
}
var http:any = new HttpClient();
console.log(http.url);  //hello*/

export function toUpper(params:string) {
    return function(target:any) {
        //console.log('target:', target.prototype.test);  //target: class HttpClient
        target.prototype.url = params;  //扩展一个url属性
        target.prototype.run = function() {
            for (let k in this[params]) {
                this[params][`${k.toUpperCase()}`] = this[params][k]
                delete this[params][k]
            }
        };
    }
}


