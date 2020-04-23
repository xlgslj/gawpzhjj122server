import * as fs from 'fs';
import * as  sharp from 'sharp'
import * as  TextToSVG from 'text-to-svg'
import * as  sysvar from  "../config/sysvar"
import * as  crypto from '../utils/tools/crypt'

let params = JSON.parse(process.argv[2])



const imgFn = (path, params) => {
    return new Promise((resolve, reject) => {
        try
        { 
            let bufferData = fs.readFileSync(path);
            //let bufferData = Buffer.from(data,'base64');  
            //console.log(bufferData.length,'xlgslj')
            let imgobj = {
                buf: null,
                params: params,
                count: 0
            }
            TextToSvg(imgobj)
            .then(TextToSvg)
            .then(TextToSvg)
            .then(TextToSvg)
            .then(imgobj => {
                sharp(bufferData)
                .composite([{
                    input: imgobj["buf"],
                    top: 10,
                    left: 10
                }])
                .toFile(path)
                .then(() => {
                    resolve()
                })
                .catch(e => {
                    reject(e)
                }) 
            })
  
        } catch (e) {
            console.log(1, 'imghc', e)
            reject(e)
        }

    })    
}
/**
 * 文字砖图片
 * {buf:图片缓冲区, params: 书据, count: 计数}
 */
const TextToSvg = (imgobj) => {
    return new Promise((resolve, reject) => {
        try {
            let textToSVG = TextToSVG.loadSync('./src/task/simhei.ttf'); // 加载字体文件
            let options = {
                x: 0,         //文本开头的水平位置（默认值：0）
                y: 0,         // 文本的基线的垂直位置（默认值：0）
                fontSize: 30, // 字体大小
                anchor: 'top', // 坐标中的对象锚点
                // letterSpacing: "",  // 设置字母的间距
                attributes: {
                    fill: '#FF3030' // 文字颜色
                }
            }
            let text
            switch (imgobj.count) {
                case 0:
                    text =' ';                
                    break;
                case 1:
                    text = `违法时间: ${imgobj.params.wfsj}      地点: ${imgobj.params.data.WFDZ}`;    
                    break;
                case 2:
                    text = `防伪码: ${crypto.md5.encrypt(JSON.stringify(imgobj.params.data))}`;           
                    break;
                case 3:
                    text = `限速: ${imgobj.params.data.BZZ}Km/h    时速: ${imgobj.params.data.SCZ}Km/h      超速: ${imgobj.params.csbl}%    设备编号: ${imgobj.params.data.SBBM}`;                
                    break;             
                default:
                    break;
            }
            let textSVG = textToSVG.getSVG(text, options);
            let buf = Buffer.from(textSVG)
            if (imgobj.count === 0) {
                sharp(buf)
                .resize(1500, 400)
                .toBuffer()
                .then(data => {
                    imgobj.buf = data
                    imgobj.count = imgobj.count + 1
                    resolve(imgobj)
                })
                .catch(e => {
                    reject(e)
                })
            } else {
                sharp(imgobj.buf)
                .composite([{
                    input: buf,
                    top: (imgobj.count -1 ) * 50,
                    left: 0
                }])
                .toBuffer()
                .then(data => {
                    imgobj.buf = data
                    imgobj.count = imgobj.count + 1
                    resolve(imgobj)
                })
                .catch(e => {
                    reject(e)
                })
            }
        } catch (e) {
            console.log(2, 'imghc',e)
            reject(e)
        }
    })
}

let fns = []
fns.push(imgFn(sysvar.extimgrootpath + params.data.IMG1.substr(1), params))
fns.push(imgFn(sysvar.extimgrootpath + params.data.IMG2.substr(1), params))
fns.push(imgFn(sysvar.extimgrootpath + params.data.IMG3.substr(1), params))
Promise.all(fns)
.then(() => {
    process.send('1')
    process.exit()
})
.catch(e => {
    console.log(3, 'imghc',e)
    process.send(e)
    process.exit()
})