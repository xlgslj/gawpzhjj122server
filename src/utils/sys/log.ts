import * as db from '../../db/db_pzhjj'
import * as sysvar from '../../config/sysvar'
/**
 * 写日志,参数: {name: 姓名... log表全字段}
 */
export const wrlog = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let log 
            let xh = await db.maxid()
            if (params.log) {
                params.log.keytoUpperCase()
                log = params.log
                log.XH = xh
            } else {

                log = {
                    XH: xh,
                    NAME: params.name || '',
                    DW: params.dw || '',
                    SJ: new Date(),
                    IP:  params.ip || '',
                    CONN:  params.conn || '',
                    CZLX:  params.czlx || '',
                    HPHM:  params.hphm || '',
                    HPZL:  params.hpzl || '',
                    WFXW:  params.wfxw || '',
                    WFSJ:  params.wfsj || null,
                    WFDD:  params.wfdd || '',
                    KEY:  xh
                }
            }
            let model = await db.model({table: `${sysvar.wztcDb}LOG2`,id: 'XH'});
            let entities =await model(log)
            await entities.insert()
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}