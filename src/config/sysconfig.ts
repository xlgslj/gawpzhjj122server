import * as db from '../db/db_pzhjj'
import * as sysvar from './sysvar'
let datas = {
    configbase: null,
    cjjgs: null,
    sjclsj: null,
    codes: null,
    cjmjs: null,
    wfdds: null,
    wfxws: null,
    tiem: 0
}
let getdata =async () => {
    let configbase = db.query("select * from CONFIGBASE where lx='系统'")
    let cjjg = db.query("select * from cjjg order by code")
    let sjclsj = db.query(`select * from ${sysvar.wztcDb}sjclsj`)
    let codes = db.query("select * from codes order by code")
    let police = db.query(`select * from ${sysvar.wztcDb}police order by c_name`)
    let road = db.query(`select * from ${sysvar.wztcDb}road order by roadname`)
    let wzxw = db.query(`select * from ${sysvar.wztcDb}wzxw order by lb,wzxwno`)
    let result = await Promise.all([configbase,cjjg,sjclsj,codes,police,road,wzxw])
    datas.configbase = result[0]
    datas.cjjgs = result[1]
    datas.sjclsj = result[2]
    datas.codes = result[3]
    datas.cjmjs = result[4]
    datas.wfdds = result[5]
    datas.wfxws = result[6]
    datas.tiem = (new Date()).getTime()
}

let getrows = async  (name, fn) => {
    let t = (new Date()).getTime() - datas.tiem
    if (t > 120000) {
        //2分钟刷新
        await getdata()
    }
    let v = datas[name].filter(fn)
    return v
}

export {getrows}