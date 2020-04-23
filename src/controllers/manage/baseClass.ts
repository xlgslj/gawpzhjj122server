//接口
interface IRfn {
    (ctx: any, next: any): Object
  }
interface IRobj {
    path: string;
    mode: string;
    method: IRfn;

}
//方法装饰器
function Action(param: string) {
    return function(target:any, methodName:any, desc:any) {
        //1. 保存原方法体
        var oldMethod = desc.value;
        //2. 重新定义方法体
        desc.value = function(...args:any[]) {
            //4. 执行原来的方法体
            let r1 = {
                path: args[0],
                mode: param,
                method: args[1]
            }
            this.routes.push(<IRobj>r1)
            oldMethod.apply(this, args);
            // 等效于 oldMethod.call(this, ...newArgs);
        }
    }
}
class CRobj {
    routes: IRobj[] = [];
    constructor() {
    }
    @Action("GET")
    get (path: string, method: Function) {}
    @Action("POST")
    post (path: string, method: Function) {}    
}

export {CRobj, IRobj}