import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as sysvar from '../../../config/sysvar'
import * as sysconfig from '../../../config/sysconfig'
let route = new CRobj();

route.get('/api/home/getndbmfxccfqk', async (ctx, next) => {
    try
    {
        const interval =  cachehour * 60 * 60
        let rdata = []
        let params=ctx.query
        let ret = new  IChttp.CRet(1);
        ret.data = await ndbmfxccfqk(params)
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

const cachehour = 24
 /**各单位年度非现场处罚情况, 参数: {dwno, year} */
let ndbmfxccfqk = (()=>{
    const interval =  cachehour * 60 * 60
    let rdata = {}
    let run = async (params) => {
        try {
            let exited = Object.keys(rdata).length >0  ? true : false
            if (exited) {
                if (parseInt(((new Date()).getTime() / 1000).toString()) - rdata["time"] > interval) {
                  exited = false
                }
            }
            //强制刷新
            exited = params.refresh ? false : exited
            if (exited) {
                return rdata['data']
            } else {
                const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                const cjjgs = await sysconfig.getrows("cjjgs",(item)=> {
                    return true
                })
                let bms = []
                cjjgs.forEach(d => {
                  if (d.CODE.substr(6) === '000000') {
                    bms.push({
                      bmno: d.CODE.substr(0, 6),
                      name: d.NAME
                    })
                  }
                })
                let sqls = []
                sqls.push(db.query("select to_char(wfsj,'mm') as month,substr(cjjgno,1,6) as bm,count(xh) as count from " + sysvar.wztcDb + "vio_zhxx where hdbj='2' and to_char(wfsj,'yyyy')='"  + params.year + "'"  + " group by  to_char(wfsj,'mm'),substr(cjjgno,1,6)"))
                let rs = await Promise.all(sqls)
                let data = []
                for (let i = 0; i < months.length; i++) {
                    let o = {}
                    let count = 0
                    for (let j = 0; j < bms.length; j++) {
                       let idx = rs[0].findIndex(d => {
                           return d.MONTH === months[i] && d.BM === bms[j].bmno
                       })
                       let len = idx > -1 ? rs[0][idx].COUNT : 0
                       o[bms[j].name] = len
                       count += len
                    }
                    o["月"] = months[i] + '月 (总量：' + count + ' )'
                    data.push(o)
                }
                let cols = ['月']
                bms.forEach(m => {
                  cols.push(m.name)
                })
                let d = {cols: cols, rows: data }

                rdata = {
                  data: d,
                  time: parseInt(((new Date()).getTime() / 1000).toString())                  
                }
                return d               
            }
        } catch {
            return []
        }
    }
    return run
})()

export {route}