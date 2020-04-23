import * as classDecorator from '../../utils/Decorator/class'

interface IRet {
    status: number
    msg?: string
    data?: any
}
/*
class CRet1 implements IRet {
    status: number
    msg?: string
    data: any
    constructor(status: number, other:string = null) {
        this.status = status
        if (other) this[other] = null
    }

}
class CRet {
    myret: IRet
    constructor (status: number, other:string = null, toup: Boolean = true) {
        this.myret = new CRet1(status)
        if (toup) {
          this.myret =  new Proxy(this.myret, {
              get(target, key) {
                //console.log('获取了getter属性');
                return target[key];
              },
              set(target, key, value) {
                 if (key === "data") {
                    for(let k in value) {
                      value[`${k.toUpperCase()}`] = value[k]
                      delete value[k]
                    }
                  }
                return Reflect.set(target, key, value);
              }
         }); 
      }       
    }
}
*/
/***没用 */
@classDecorator.toUpper('data')
export class CRet implements IRet {
  status: number
  msg?: string
  data?: any
  constructor(status: number, other?:string) {
      this.status = status
      if (other&&status) this[other] = null   
      if (!status) console.log(other)   
  }
}
