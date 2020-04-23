import * as webserviceClient from '../base/webserviceClient'
import * as fxp  from "fast-xml-parser";
import * as db from '../../db/db_pzhjj'
let options = {
    // select chr(39)||lower(A.COLUMN_NAME)||chr(39)||',' from user_tab_columns A where TABLE_NAME='BAS_TRANSPCORP_VEH' and (data_type = 'CHAR' or data_type='VARCHAR2')
    //stopNodes: 不需要解析的标记名数组(此数组中的都解析为字符串(数值型的解析为字符串),否则按原值解析(数值型的不会解析为字符串))。
    stopNodes: ['sfxsjly','sfgps','aqlxr','aqsjhm','aqlxdh','jbr','bz','syr','syq','fzjg','zzbj','clsbdh','fdjh','clpp1','clxh','cllx','csys','syxz','zt','zsxxdz','yzbm1','zsxzqh','lxdh','sjhm','dzyx','jlzt','glbm','xszbh','jyhgbzbh','sfzmhm','sfzmmc','zzxxdz','yzbm2','qyfzjg','clyt','ysxl','sscz','ssczlxdh','ssczsjhm','sfbk','qybh','xh','hpzl','hphm','yylx','ysfw','sfgk']
};
export async function fromWebservice (hphm, hpzl) {
    try {
        let r = await webserviceClient.handler25('jdcxx_all', {hphm: hphm, hpzl: hpzl})
        const res = fxp.parse(r["jdcxx_allResult"], options);
        const head = res.root.head
        const body = res.root.body
        if (head.code === 0) {
            return null
          } else {
            if (head.rownum === 0) {
                return null
            } else {
              if (head.rownum === 1) {
                const veh = body.veh
                veh.keytoUpperCase()
                return veh
              } else {
                const veh = body.veh[0]
                veh.keytoUpperCase()
                return veh
              }
            }
          }        
    } catch (e) {
        throw e
    }
}

export async function fromjcxxpt (hphm, hpzl) {
    try {
        let res = await db.query(" select b.dwmc,a.* from BAS_TRANSPCORP_VEH a ,BAS_TRANSPCORP b where hphm='" + hphm + "' and hpzl='" + hpzl +"' and a.qybh = B.QYBH(+)")        
        return res.length ? res[0] : null
    } catch (e) {
        throw e
    }
}