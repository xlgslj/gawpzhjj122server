
import * as fs from 'fs'
import * as koarouter from 'koa-router';
import * as path from 'path'
import {CRobj, IRobj} from './baseClass'
let addMapping =async function(router, mapping: IRobj[]) {
    for (var url of mapping) {
         if (url.mode === 'GET') {
            router.get(url.path, url.method);
        } else if (url.mode === 'POST') {
            router.post(url.path, url.method);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

let addControllers = async function (router, dir: string) {
    /*var files = fs.readdirSync(`${__dirname}/${dir}`);
    var js_files = files.filter((f) => {
        return f.endsWith('.ts');
    });

    for (var f of js_files) {
        console.log(`process controller: ${f} ...`);
        //let mapping = require(__dirname + '/controllers/' + f);
        let map = await import(`${__dirname}/../${f}`)
        await addMapping(router,(<CRobj>map.route).routes);
    }*/
    if(!fs.existsSync(dir)) throw new Error("目录不存在");
    fs.readdirSync(dir).map(async value=>{
        var stats=fs.statSync(`${dir}/${value}`);
        if(stats.isFile()){
            console.log(`加载: ${dir}/${value} ...`);            
            let map = await import(`${dir}/${value}`)
            if (map.route)  await addMapping(router,(<CRobj>map.route).routes);
        }
        if(stats.isDirectory()){
            if (value !== 'manage')  addControllers(router,`${dir}/${value}`)
        }
    })
}

async function LoadRouter (dir: string = `${__dirname}/..`) {
    console.log('route reading...')
    let router =new koarouter();
    await addControllers(router, dir);
    console.log('route completed')
    return router.routes();
}
export {LoadRouter}



