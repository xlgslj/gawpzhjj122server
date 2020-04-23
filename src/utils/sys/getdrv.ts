import * as webserviceClient from '../base/webserviceClient'
import * as fxp  from "fast-xml-parser";
import * as db from '../../db/db_pzhjj'

let options = {
    // select chr(39)||lower(A.COLUMN_NAME)||chr(39)||',' from user_tab_columns A where TABLE_NAME='BAS_TRANSPCORP_VEH' and (data_type = 'CHAR' or data_type='VARCHAR2')
    stopNodes: ['qybh','xh','dabh','sfzmmc','sfzmhm','yylx','hpzl','hphm','jbr','bz','xm','xb','zjcx','fzjg','zxbh','zzbj','djzsxzqh','djzsxxdz','lxzsxxdz','lxzsyzbm','ccfzjg','jzqx','zt','jxmc','lxdh','sjhm','xzqh','dzyx','jlzt','glbm','xczg','qyfzjg','cyzgzh','xczjcx']
};

export async function fromWebservice (shzmhm) {
    try {
        let r = await webserviceClient.handler25('getDriver', {sfzhm: shzmhm})
        const res = fxp.parse(r["getDriverResult"], options);
        const head = res.root.head
        const body = res.root.body
        if (head.code === 0) {
            return null
          } else {
            if (head.rownum === 0) {
                return null
            } else {
                let drv = body.DrvPerson
                drv.keytoUpperCase()
                return drv
            }
          }        
    } catch (e) {
        throw e
    }
}

export async function fromjcxxpt (sfzmhm) {
    try {
        let res = await db.query(" select * from BAS_TRANSPCORP_DRV where sfzmhm='" +sfzmhm + "'")        
        return res.length ? res[0] : null
    } catch (e) {
        throw e
    }
}