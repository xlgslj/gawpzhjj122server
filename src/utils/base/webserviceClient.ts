
const soap = require('soap')
import * as sysvar from '../../config/sysvar'
export const handler25 = (method, args) => {
    return new Promise((resolve, reject) => {
        soap.createClient(sysvar.wsdlurl25, function(err, client) {
            if (err) {
                reject(err)
            }
            try
            {
                client[method](args, function(err, result) {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                });
            } catch (e) {
                reject(e.message)
            }
        })
    })
}
export const handler123 = (method, args) => {
    return new Promise((resolve, reject) => {
        soap.createClient(sysvar.wsdlurl123, function(err, client) {
            if (err) {
                reject(err)
            }
            try
            {
                client[method](args, function(err, result) {
                    if (err) {
                        reject(err)
                    }
                    resolve(result)
                });
            } catch (e) {
                reject(e.message)
            }
        })
    })
}