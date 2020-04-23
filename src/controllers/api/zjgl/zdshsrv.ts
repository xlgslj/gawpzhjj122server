import * as db from '../../../db/db_pzhjj'
import * as sysvar from '../../../config/sysvar'
import * as imgtobase64 from '../../../utils/tools/imgtobase64'
import * as webservice from '../../../utils/base/webserviceClient'
import * as logsrv from '../../../utils/sys/log'
import * as red from './red'

let get_tmp_wfdata = (params) =>{
    return new Promise(async (resolve, reject) =>{
        try {
            let result = await db.query(`select * from ${sysvar.wztcDb}VIO_ZHXX where xh='${params.xh}'`)
            if (result.length) {
                /*result[0].dataParser({
                    WFSJ: 'datestr',
                    LRSJ: 'datestr'
                })*/
                let wfdata = Object.assign({}, {req: params, vio: result[0]})
                resolve(wfdata)                
            } else {
                reject("设备采集-审核通过:设备采集表中记录不存在")                
            }

        } catch (e) {
            reject("设备采集-审核通过:提取数据错误;@" + e)
        }
    })
}

let insert = (wfdata) => {
    /* 写入到正式库 */
    return new Promise(async (resolve, reject) => {
        try {
            if (!wfdata) {
                resolve(0)
            } else { 
                let result = await insert_imgup(wfdata);  
                wfdata.imgdata = result
                await insert_dataup(wfdata)
                resolve(wfdata)
            }
        }  catch (e) {
            reject(e)
        }
    })
}

let insert_imgup = (wfdata) => {
    return new Promise(async (resolve, reject) =>{
        try {
            let run = [
                imgtobase64.base64_encode(sysvar.localimgrootpath + wfdata.vio.IMG1),
                imgtobase64.base64_encode(sysvar.localimgrootpath + wfdata.vio.IMG2)
                ]
            if (wfdata.vio.IMG3) run.push(imgtobase64.base64_encode(sysvar.localimgrootpath + wfdata.vio.IMG3))                
            if (wfdata.vio.IMG4) run.push(imgtobase64.base64_encode(sysvar.localimgrootpath + wfdata.vio.IMG4))
            let result= await  Promise.all(run)
            resolve(result)
        } catch (e) {
            reject(e)
        }
    })
}

let insert_dataup = (wfdata) =>{
    return new Promise(async (resolve, reject) =>{
        try {
            resolve(wfdata)                        
        } catch (e) {
            reject(e)
        }
    })
}

let to_gaw = (wfdata) => {
    return new Promise(async (resolve, reject)=>{
        try {
            if (!wfdata) {
                resolve(0)
            } else {
                let imglength = wfdata.imgdata.length
                var args = {
                    sbbh: wfdata.vio.SBBM,
                    zqmj: '',
                    clfl: '',
                    hphm: wfdata.vio.HPHM,
                    hpzl: wfdata.vio.HPZLNO,
                    xzqh: wfdata.vio.XZQH,
                    wfdd: wfdata.vio.WFDDNO,
                    lddm: '',
                    ddms: '',
                    wfdz: wfdata.vio.WFDZ,
                    wfsj: wfdata.vio.WFSJ.Format('yyyy-MM-dd HH:mm:ss'),
                    wfsj1: '',
                    //wfxw: (wfdata.vio.BKLB ==='2' || wfdata.vio.BKLB ==='3' ) ? '' : wfdata.vio.WZXWNO,
                    wfxw: wfdata.vio.WZXWNO,
                    scz: wfdata.vio.SCZ ? `${wfdata.vio.SCZ}` : '0',
                    bzz: wfdata.vio.BZZ ? `${wfdata.vio.BZZ}` : '0',
                    zpsl: '3',
                    zpwjm: '',
                    zpstr1: wfdata.imgdata[wfdata.req.firstimgidx],
                    zpstr2: wfdata.imgdata[(wfdata.req.firstimgidx + 1) < (imglength - 1) ? (wfdata.req.firstimgidx + 1) : wfdata.req.firstimgidx],
                    zpstr3: wfdata.imgdata[(wfdata.req.firstimgidx + 2) <=  (imglength - 1) ? (wfdata.req.firstimgidx + 2) : (wfdata.req.firstimgidx + 1)]
                }
                let  result = await webservice.handler123("InsertToBeScreened", args) //InsertToBeScreened
                
                if (!(result["InsertToBeScreenedResult"] === '0')) {
                    let err = result["InsertToBeScreenedResult"]
                    let model1 = await db.model({table: `${sysvar.wztcDb}vio_zhxx`,id: 'XH'});
                    let entities1 =await model1({
                        XH: wfdata.vio.XH,
                        HDBJ: '2',
                        DRBJ: '1',
                        GXSJ: new Date(),
                        IMP_RESULT: err
                    })
                    await entities1.update()
                    reject("设备采集-审核通过:上传公安网异常;@" + err)
                } else {
                    let log = {
                        // 增加日志数据
                        key: wfdata.req.xh,
                        name: wfdata.req.name,
                        sj: new Date(),
                        dw: wfdata.req.dwname,
                        czlx: '支队筛选通过',
                        conn: '支队筛选通过一条证据',
                        hphm: wfdata.vio.HPHM,
                        hpzl: wfdata.vio.HPNAME,
                        wfsj: wfdata.vio.WFSJ,
                        wfxw: wfdata.vio.WZXW || '',
                        wfdd: wfdata.vio.WFDZ
                    }  
                    let model1 = await db.model({table: `${sysvar.wztcDb}vio_zhxx`,id: 'XH'});
                    let entities1 =await model1({
                        XH: wfdata.vio.XH,
                        DRBJ: '0',
                        GXSJ: new Date(),
                        HDBJ: '2'
                    })
                    await entities1.update()
                    await logsrv.wrlog({
                        log: log
                    })
                    resolve()
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

export const shtghandler = (params) => {
    return new Promise((resolve, reject) => {
        get_tmp_wfdata(params)
        .then(red.pass)
        .then(insert)
        .then(to_gaw)
        .then(result => {
            resolve()
        })
        .catch(err => {
            reject(err)
        })
    })
}


let shbgt = (wfdata) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!wfdata) {
                resolve(0)
            } else { 
                let model1 = await db.model({table: `${sysvar.wztcDb}vio_zhxx`,id: 'XH'});
                let entities1 =await model1({
                    XH: wfdata.vio.XH,
                    HDBJ: '5',
                    SHBTGYY:  wfdata.req.sqyy ,
                    SHBTGSQR:  wfdata.req.name,
                    GXSJ: new Date()
                })
                await entities1.update()
                let log = {
                    // 增加日志数据
                    key: wfdata.req.xh,
                    name: wfdata.req.name,
                    sj: new Date(),
                    dw: wfdata.req.dwname,
                    czlx: '申请审核不通过',
                    conn: '申请审核不通过一条证据',
                    hphm: wfdata.vio.HPHM,
                    hpzl: wfdata.vio.HPNAME,
                    wfsj: wfdata.vio.WFSJ,
                    wfxw: wfdata.vio.WZXW || '',
                    wfdd: wfdata.vio.WFDZ
                }
                await logsrv.wrlog({
                    log: log
                })
                resolve()                  
            }
        } catch (e) {
            reject(e)
        }
    })
}

export const sqshbtghandler = (params) => {
    return new Promise((resolve, reject) => {
        get_tmp_wfdata(params)
        .then(insert)
        .then(shbgt)
        .then(result => {
            resolve()
        })
        .catch(err => {
            reject(err)
        })
    })
}