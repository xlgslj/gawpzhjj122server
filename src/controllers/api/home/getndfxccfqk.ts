
import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as sysvar from '../../../config/sysvar'
let route = new CRobj();

const cachehour = 24


/**各单位年度非现场处罚情况, 参数: {dwno, year} */
route.get('/api/home/getndfxccfqk', async (ctx, next) => {
    try
    {
        const interval =  cachehour * 60 * 60
        let rdata = []
        let params=ctx.query
        let ret = new  IChttp.CRet(1);
        ret.data = await ndfxccfqk(params)
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

/**各单位年度非现场处罚情况, 参数: {dwno, year},闭包 */
let ndfxccfqk = ((params) => {
    const interval =  cachehour * 60 * 60
    let rdata = []
    let run = async (params) => {
        try {
            let idx =  rdata.findIndex(d => d.dwno === params.dwno)
            let exited = idx > -1 ? true : false
            if (exited) {
                if (parseInt(((new Date()).getTime() / 1000).toString()) - rdata[idx].time > interval) {
                  exited = false
                }
            }
            //强制刷新
            exited = params.refresh ? false : exited  
            if (exited) {
                return rdata[idx].data
            } else {
                const bmwhere = params.dwno === '510400000000' ? '' : ` and substr(cjjgno,1,6)=\'${params.dwno.substr(0,6)}\'`
                const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                let mks = [
                    {name: '违停', bklb: '1'},
                    {name: '移动测速', bklb: '2'},
                ]
                if (params.dwno === '510400000000') {
                  mks.push({name: '固定测速', bklb: '3'})
                  mks.push({name: '电子警察', bklb: '4'})
                }
                let sqls = []
                sqls.push(db.query("select to_char(wfsj,'mm') as month,bklb,count(xh) as count from " + sysvar.wztcDb + "vio_zhxx where hdbj='2' and to_char(wfsj,'yyyy')='"  + params.year + "'" + bmwhere + " group by  to_char(wfsj,'mm'),bklb"))           
                let rs = await Promise.all(sqls)
                let data = []
                for (let i = 0; i < months.length; i++) {
                    let o = {}
                    let count = 0
                    for (let j = 0; j < mks.length; j++) {
                       let idx = rs[0].findIndex(d => {
                           return d.MONTH === months[i] && d.BKLB === mks[j].bklb
                       })
                       let len = idx > -1 ? rs[0][idx].COUNT : 0
                       o[mks[j].name] = len
                       count += len
                    }
                    o["月"] = months[i] + '月 (总量：' + count + ' )'
                    data.push(o)
                }
                let cols = ['月']
                mks.forEach(m => {
                  cols.push(m.name)
                })
                let d = {cols: cols, rows: data }
    
                let idx1 = rdata.findIndex(d => d.dwno === params.dwno) 
                if (idx1 > -1) {
                  rdata.splice(idx1, 1, {dwno: params.dwno, data: d, time: parseInt(((new Date()).getTime() / 1000).toString())})
                } else {
                  rdata.push({
                     dwno: params.dwno,
                     data: d,
                     time: parseInt(((new Date()).getTime() / 1000).toString())
                  })
                }
                return d         
            }              
            
        } catch (e) {
            return []
        }
    }
    return run
  }) ()

export {route}