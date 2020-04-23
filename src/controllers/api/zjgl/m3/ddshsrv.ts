import * as db from '../../../../db/db_pzhjj'
import * as sysconfg from '../../../../config/sysconfig'
import * as sysvar from '../../../../config/sysvar'
import * as logsrv from '../../../../utils/sys/log'

/**
 * **********************************************定点测速审核通过***************************************
 * { xh: '1004197458',
  bklb: '3',
  jdcsyr: '李周涛',
  xxdz: '四川省攀枝花市东区钢城大道东段374号2栋1单元1楼7号',
  dh: '15983564172',
  cgclpp: '长安牌',
  cgcsys: '灰',
  syxz: 'L',
  syxz2: 'L:营转非',
  cllx: 'H31',
  cllx2: 'H31:轻型普通货车',
  wzxwno: '6046',
  wzxw: '6046:驾驶机动车在限速低于60公里/小时的公路上超过规定车速50%以下的',
  csbl: '13' }
 *
 */

const getdata = (params, maxtime = true) => {
    return new Promise(async (resolve, reject) => {
        try {
            let maxsj = (await sysconfg.getrows('sjclsj', (item) => {
                return item.MK === '支队审核' && item.SUBSYS === '非现场执法'
            }))[0].SJ
            let res = await db.query(`select * from ${sysvar.wztcDb}VIO_ZHXX_EXT_TEMP where xh='${params.xh}'`)
            if (res.length) {
                let sj = Math.floor(((new Date().getTime() - res[0].WFSJ.getTime())) / 1000 / 60 / 60)
                if (sj > maxsj &&maxtime) {
                    reject('数据超过限定时间')
                } else {
                  let d = Object.assign(params,{data: res[0]})
                  resolve(d)
                }
            } else {
                reject('数据不存在')   
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updatedata = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let v = {
                XH: params.data.XH,
                HDBJ : '0'
            }
            let model = await db.model({table: `${sysvar.wztcDb}VIO_ZHXX_EXT_TEMP`,id: 'XH'});
            let entities =await model(v)
            await entities.update()

            let log = {
                // 增加日志数据
                key: params.xh,
                name: params.name,
                sj: new Date(),
                dw: params.dwname,
                czlx: '审核通过',
                conn: '公司审核通过一条证据',
                hphm: params.data.HPHM,
                hpzl: params.data.HPNAME,
                wfsj: params.data.WFSJ,
                wfxw: params.data.WFXW || '',
                wfdd: params.data.WFDZ
            }          
            resolve(Object.assign(params, {log: log}))
        } catch (e) {
            reject(e)
        }
    })
}

export const shtghandler = (params) => {
    return new Promise((resolve, reject) => {
        getdata(params)
        .then(updatedata)
        .then(logsrv.wrlog)        
        .then(result => {
            resolve()
        })
        .catch(err => {
            reject(err)
        })
    })
}

/**
 * **********************************************定点测速审核不通过***************************************
 * { xh: '1004196807',
  sqyy: '违法图片不符合要求',
  bklb: '4',
  firstimgidx: 1,
  ip: '127.0.0.1',
  dwno: '510400000000',
  dwname: '攀枝花市公安局交通警察支队',
  uid: '000000003120',
  loginname: 'admin',
  name: '系统管理员' }
 */

const InsertNOAndDel = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let model1 = await db.model({table: `${sysvar.wztcDb}VIO_ZHXX_EXT_NO`,id: 'XH'});
            let entities1 =await model1(params.data)
            //await entities1.insert()
            let model2 = await db.model({table: `${sysvar.wztcDb}VIO_ZHXX_EXT_TEMP`,id: 'XH'});
            let entities2 =await model2({
                xh: params.data.XH
            })
            //await entities2.delete()
            await Promise.all([entities1.insert(), entities2.delete()]) 
            let log = {
                // 增加日志数据
                key: params.xh,
                name: params.name,
                sj: new Date(),
                dw: params.dwname,
                czlx: '设备采集',
                conn: '公司删除一条证据',
                hphm: params.data.HPHM,
                hpzl: params.data.HPNAME,
                wfsj: params.data.WFSJ,
                wfxw: params.data.WFXW || '',
                wfdd: params.data.WFDZ
            }          
            resolve(Object.assign(params, {log: log}))
        } catch (e) {
            reject(e)
        }
    })
}

export const delhandler = (params) => {
    return new Promise((resolve, reject) => {
        getdata(params, false)
        .then(InsertNOAndDel)
        .then(logsrv.wrlog)
        .then(result => {
            resolve()
        })
        .catch(err => {
            reject(err)
        })
    })
}
